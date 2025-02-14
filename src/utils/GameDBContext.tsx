import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SQLite from 'expo-sqlite';
import { parseString, Builder } from 'xml2js';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase, ref, onValue, set, get, update } from 'firebase/database';
import { database } from '../config/firebaseConfig';
import { versionOneData } from '../config/VersionOneData';

const nextLine = '\n';
const breakLine = '-------------------------------------------------------------------------------------------------------------------------------------------------------------';

interface GameDBContextType {
  db: SQLite.SQLiteDatabase | null;
  createGame: (...args: any[]) => Promise<any>;
  generateGameId: () => string;
  generateGamePin: (name: string, category: string) => Promise<string>;
  getGamesByXML: () => Promise<string>;
  createGameByBatch: (xmlData: string) => Promise<void>;
  updateImageByPin: (pin: string, game_image: string | null, q1_image: string | null, q2_image: string | null, q3_image: string | null, q4_image: string | null) => Promise<void>;
  searchGame: (name: string, category: string[], subcategory: string, createdBy: string) => Promise<any[]>;
  updateGameById (gameId: string,    name: string,    type: string,    isPublic: boolean,    isPopular: boolean,
      category: string,    subCategory: string,    remark: string,    updatedBy: string,    updatedDate: string,    image: string | null);  
  createGameByExcel: (data: string) => Promise<void>;
  loadGamesByDynamicColumn: (columnName: string, columnOperator: string, columnData: string, )  => Promise<any[]>;
  checkDailyLimit: (userId: string) => Promise<any>;
  incrementDailyPlayCount: (userId: string) => Promise<void>;
  initData_SQLite: () =>  Promise<void>;


  loadGameByPin: (pin: string, isSolo: boolean, isHost: boolean, isHostPlayer: boolean, isMultiPlayer: boolean) => Promise<any | null>;
  loadGameById: (gameId: string) => Promise<any | null>;
  loadGamesByCategory: (category: string) => Promise<any[]>;
  loadGames: () => Promise<any[]>;

  deleteAllGames: () => Promise<void>;
  deleteGameById(gameId: string);
  deleteQuestionById(questionId: string);
  deleteAnswerById(answerId: string);


  downloadGameFromFirebase: (data: string) => Promise<void>;  
  initializeGameAsHost: (gameState: any) => Promise<any>;
  updateGameStateInFirebase: (localGameState: any, isHost: string) => Promise<void>;
  fetchGameStateFromFirebase: (gameState: any) => Promise<any[]>;
}

interface Game {
  gameId: string;  name: string;  pin: string;  type: string;  isPublic: boolean;  isPopular: boolean;  category: string;  
  subCategory: string;  remark: string;  createdBy: string;  createdDate: string;  updatedBy: string;  updatedDate: string;  
  ts: string;  image: string | null;  maxPin: string | null;
}

interface Question {
  questionId: string;  text: string;  type: string;
}

interface Answer {
  text: string;  correctAnswer: number;
}

interface QuestionWithAnswers extends Question {
  answers: Answer[];
}

interface GameWithQuestions extends Game {
  questions: QuestionWithAnswers[];
}

const initialContextValue: GameDBContextType = {// Initialize context with initial values
  db: null,
  createGame: async () => {},
  generateGameId: () => '',
  generateGamePin: async () => '',
  getGamesByXML: async () => '',  
  createGameByBatch: async () => {},
  updateImageByPin: async () => {},
  searchGame: async () => [],
  updateGameById: async () => [],
  createGameByExcel: async () => {},
  loadGamesByDynamicColumn: async () => [],
  checkDailyLimit: async () => 0,
  incrementDailyPlayCount: async () => null,
  deleteAllGames: async () => {},
  initData_SQLite: async () => {},  


  loadGameByPin: async () => null,
  loadGameById: async () => null,
  loadGamesByCategory: async () => [],
  loadGames: async () => [],
    
  deleteGameById: async () => [],
  deleteQuestionById: async () => [],
  deleteAnswerById: async () => [],
  

  downloadGameFromFirebase: async () => null,  
  initializeGameAsHost: async () => [],
  updateGameStateInFirebase: async () => null,
  fetchGameStateFromFirebase: async () => [],
  
};

const GameDBContext = createContext<GameDBContextType>(initialContextValue);

export const useGameDB = () => useContext(GameDBContext);

interface GameDBProviderProps {
  children: ReactNode;
}

export const GameDBProvider: React.FC<GameDBProviderProps> = ({ children }) => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {  
    const initializeAndDownload = async () => {
      try {
        await initDB();          
      } catch (error) {
        console.error('GameDBContext/initializeAndDownload/Error: Error during initialization and download:', error);
      }
    };

    initializeAndDownload();
  }, []);

  const initDB = async () => {
    try {
      const database = await SQLite.openDatabaseAsync('questionGameDB.db');
      setDb(database);
      await database.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS games (
          gameId TEXT PRIMARY KEY NOT NULL,
          name TEXT,          pin TEXT,          type TEXT,
          isPublic INTEGER,          isPopular INTEGER,          category TEXT,
          subCategory TEXT,          remark TEXT,          image TEXT,
          createdBy TEXT,          createdDate TEXT,          updatedBy TEXT,
          updatedDate TEXT,          ts TEXT
        );
        CREATE TABLE IF NOT EXISTS questions (
          questionId INTEGER PRIMARY KEY AUTOINCREMENT,
          gameId TEXT,          text TEXT,          type TEXT,          image TEXT,
          FOREIGN KEY (gameId) REFERENCES games (gameId)
        );
        CREATE TABLE IF NOT EXISTS answers (
          answerId INTEGER PRIMARY KEY AUTOINCREMENT,
          questionId INTEGER,          text TEXT,          correctAnswer INTEGER,
          FOREIGN KEY (questionId) REFERENCES questions (questionId)
        );
        CREATE TABLE IF NOT EXISTS downloadVersion (
          versionNo TEXT
        );
        CREATE TABLE IF NOT EXISTS play_count (
          id INTEGER PRIMARY KEY NOT NULL,
          date TEXT,
          count INTEGER,
          user_id TEXT
        );
        CREATE TABLE IF NOT EXISTS premium_users (
          user_id TEXT PRIMARY KEY NOT NULL
        );
      `);
      console.log("GameDBContext/initDB/Log: SQLite DB Initialized", nextLine, breakLine)
    } catch (error) {
      console.error('GameDBContext/initDB/Error: Error initializing database:', error, nextLine, breakLine);
    }
  };  

  const initData_SQLite = async () => {
    try {
      
      if (!db) {
        throw new Error('SQLiteDB not initialized');
      } 
     
        const gameResults = await db.getAllAsync<Game>('SELECT * FROM games');

        //console.log("gameResults", gameResults);

        if (gameResults && gameResults.length < 1) {
          console.log('GameDBContext/initData_SQLite/Log: SQLite initializing data started.');         

          await createGameByExcel(versionOneData);
        }
        else{
          console.log('GameDBContext/initData_SQLite/Log: empty gameResults or gameResults.length > 1');
        }
      } catch (error) {
        console.log('GameDBContext/initDB/Error: Error SQLite initializing data:', nextLine, breakLine);
      }
  };

  const createGame = async (gameData: any): Promise<any> => {
    try {
        if (!db) {
            throw new Error('SQLiteDB not initialized');
        }

        const existingGame = await db.getAllAsync<Game>('SELECT * FROM games WHERE name = ? AND category = ?', [gameData.name, gameData.category]);
        if(existingGame.length > 0){
          throw new Error('Save unsuccessful! There is existing game with same name.');
        }
       
        let gameId = '';
        if (gameData.gameId)  gameId = gameData.gameId;
        else gameId = generateGameId();        
        
        let gamePin = '';
        if (gameData.pin) gamePin = gameData.pin;
        else await generateGamePin(gameData.name, gameData.category);        

        const gameResult = await db.runAsync(
            `INSERT INTO games (gameId, name, pin, type, isPublic, isPopular, category, subCategory, remark, image, createdBy, createdDate, updatedBy, updatedDate, ts) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                gameId, gameData.name, 
                gamePin, gameData.type? gameData.type : 'Classic',
                gameData.isPublic ? 1 : 0,
                gameData.isPopular ? 1 : 0,
                gameData.category, gameData.subCategory, gameData.remark, gameData.image,
                gameData.createdBy, gameData.createdDate, gameData.updatedBy, gameData.updatedDate,
                gameData.ts,
            ]
        );        
        
        for (const question of gameData.questions) {
            const questionResult = await db.runAsync(
                `INSERT INTO questions (gameId, text, type) VALUES (?, ?, ?)`,
                [gameId, question.text, question.type]
            );

            const questionId = questionResult.lastInsertRowId; 
            
            for (const answer of question.answers) {              

                await db.runAsync(
                    `INSERT INTO answers (questionId, text, correctAnswer) VALUES (?, ?, ?)`,
                    [questionId, answer.text, answer.correctAnswer? 1 : 0]
                );
            }
        }
        console.log('GameDBContext/createGame/Log: Game created', nextLine, breakLine);
        await initDB();
        return gameId;
    } catch (error) {
        console.error('GameDBContext/createGame/Error: Error creating game:', error, nextLine, breakLine);
        throw error;
    }
  };

  const loadGameByPin = async (
    pin: string,     isSolo: boolean,    isHost: boolean,    isHostPlayer: boolean,    isMultiPlayer: boolean
  ): Promise<GameWithQuestions | null> => {
    try {
      
      if (!db) {
        throw new Error('SQLiteDB not initialized');
    }      
  
      if (isHost || isHostPlayer) {
        const gameResults = await db.getAllAsync<Game>('SELECT * FROM games WHERE pin = ?', [pin]);
  
        if (gameResults.length > 0) {
          const game = gameResults[0];
  
          const questionsResult = await db.getAllAsync<Question>('SELECT * FROM questions WHERE gameId = ?', [game.gameId]);
          const questionsArray: QuestionWithAnswers[] = [];
  
          for (const question of questionsResult) {
            const answersResult = await db.getAllAsync<Answer>('SELECT * FROM answers WHERE questionId = ?', [question.questionId]);
            const answersArray = [];
  
            for (const answer of answersResult) {
              answersArray.push({
                text: answer.text,
                correctAnswer: answer.correctAnswer === 1,
              });
            }
  
            questionsArray.push({
              ...question,
              answers: answersArray,
            });
          }
  
          const gameWithImage: GameWithQuestions = {
            ...game,
            isPublic: game.isPublic === true,
            questions: questionsArray,
          };
  
          return gameWithImage;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.error('GameDBContext/loadGameByPin/Error:', error, nextLine, breakLine);
      return null;
    }
  };  
  
  const loadGameById = async (gameId: string): Promise<any | null> => {
    try {
      if (!db) {
        throw new Error('SQLiteDB not initialized');
      }

      const gameResult = await db.getAllAsync<Game>(`SELECT * FROM games WHERE gameId = ?`, [gameId]);
      //console.log('gameResult', gameResult);

      if (gameResult.length > 0) {
        const game = gameResult[0];

        const questionsResult = await db.getAllAsync<Question>(`SELECT * FROM questions WHERE gameId = ?`, [game.gameId]);
        const questionsArray = [];

        for (let j = 0; j < questionsResult.length; j++) {
          const question = questionsResult[j];
          const answersResult = await db.getAllAsync<Answer>(`SELECT * FROM answers WHERE questionId = ?`, [question.questionId]);
          const answersArray = [];

          for (let k = 0; k < answersResult.length; k++) {
            const answer = answersResult[k];
            answersArray.push({
              text: answer.text,
              correctAnswer: answer.correctAnswer === 1,
            });
          }         

          questionsArray.push({
            questionId: question.questionId,
            text: question.text,
            type: question.type,
            answers: answersArray,
          });
        }

        const gameWithImage = {
          gameId: game.gameId,
          name: game.name,
          pin: game.pin,
          type: game.type,
          isPublic: game.isPublic === true,
          isPopular: game.isPopular,
          category: game.category,
          subCategory: game.subCategory,
          remark: game.remark,
          createdBy: game.createdBy,
          createdDate: game.createdDate,
          updatedBy: game.updatedBy,
          updatedDate: game.updatedDate,
          ts: game.ts,
          image: game.image,
          questions: questionsArray,
        };        

        //console.log('gameWithImage', gameWithImage);
        return gameWithImage;
      } else {
        return null;
      }
    } catch (error) {
      console.error('GameDBContext/loadGameById/Error:', error, nextLine, breakLine);
      throw error;
    }
  };

  const loadGamesByCategory = async (category: string): Promise<any[]> => {
    try {
      if (!db) {
        throw new Error('SQLiteDB not initialized');
      }

      const results = await db.getAllAsync<Game>(`SELECT * FROM games WHERE category = ?`, [category]);
      const gamesArray = [];

      for (let i = 0; i < results.length; i++) {
        const game = results[i];

        const questionsResult = await db.getAllAsync<Question>(`SELECT * FROM questions WHERE gameId = ?`, [game.gameId]);
        const questionsArray = [];

        for (let j = 0; j < questionsResult.length; j++) {
          const question = questionsResult[j];
          const answersResult = await db.getAllAsync<Answer>(`SELECT * FROM answers WHERE questionId = ?`, [question.questionId]);
          const answersArray = [];

          for (let k = 0; k < answersResult.length; k++) {
            const answer = answersResult[k];
            answersArray.push({
              text: answer.text, correctAnswer: answer.correctAnswer === 1,
            });
          }

          questionsArray.push({
            questionId: question.questionId, text: question.text, type: question.type, answers: answersArray,
          });
        }

        const gameWithImage = {
          gameId: game.gameId,
          name: game.name,
          pin: game.pin,
          type: game.type,
          isPublic: game.isPublic === true,
          isPopular: game.isPopular,
          category: game.category,
          subCategory: game.subCategory,
          remark: game.remark,
          createdBy: game.createdBy,
          createdDate: game.createdDate,
          updatedBy: game.updatedBy,
          updatedDate: game.updatedDate,
          ts: game.ts,
          image: game.image, // Include image data
          questions: questionsArray,
        };

        gamesArray.push(gameWithImage);
      }

      return gamesArray;
    } catch (error) {
      console.error('GameDBContext/loadGamesByCategory/Error:', error, nextLine, breakLine);
      return [];
    }
  };

  const loadGamesByDynamicColumn = async (columnName: string, columnOperator: string, columnData: string): Promise<any[]> => {
    try {
      if (!db) {
        throw new Error('SQLiteDB not initialized');
      }

      const query = `SELECT * FROM games WHERE ${columnName} ${columnOperator} ?`;      
      const results = await db.getAllAsync<Game>(query, [columnData]);      

      //const results = await db.getAllAsync<Game>(`SELECT * FROM games WHERE ? = ?`, [columnName],[columnData]);
      const gamesArray = [];

      for (let i = 0; i < results.length; i++) {
        const game = results[i];

        const questionsResult = await db.getAllAsync<Question>(`SELECT * FROM questions WHERE gameId = ?`, [game.gameId]);
        const questionsArray = [];

        for (let j = 0; j < questionsResult.length; j++) {
          const question = questionsResult[j];
          const answersResult = await db.getAllAsync<Answer>(`SELECT * FROM answers WHERE questionId = ?`, [question.questionId]);
          const answersArray = [];

          for (let k = 0; k < answersResult.length; k++) {
            const answer = answersResult[k];
            answersArray.push({
              text: answer.text, correctAnswer: answer.correctAnswer === 1,
            });
          }

          questionsArray.push({
            questionId: question.questionId, text: question.text, type: question.type, answers: answersArray,
          });
        }

        const gameWithImage = {
          gameId: game.gameId,
          name: game.name,
          pin: game.pin,
          type: game.type,
          isPublic: game.isPublic === true,
          isPopular: game.isPopular,
          category: game.category,
          subCategory: game.subCategory,
          remark: game.remark,
          createdBy: game.createdBy,
          createdDate: game.createdDate,
          updatedBy: game.updatedBy,
          updatedDate: game.updatedDate,
          ts: game.ts,
          image: game.image,
          questions: questionsArray,
        };

        gamesArray.push(gameWithImage);
      }

      return gamesArray;
    } catch (error) {
      console.error('GameDBContext/loadGamesByDynamicColumn/Error:', error, nextLine, breakLine);
      return [];
    }
  };

  const deleteAllGames = async (): Promise<void> => {
    try {
      if (!db) {
        throw new Error('SQLiteDB not initialized');
      }

      await db.execAsync(`DROP TABLE IF EXISTS downloadVersion`);
      await db.execAsync(`DROP TABLE IF EXISTS answers`);
      await db.execAsync(`DROP TABLE IF EXISTS questions`);
      await db.execAsync(`DROP TABLE IF EXISTS games`);


      initDB();

      console.log('GameDBContext/deleteAllGames/Log: All game tables dropped from the database.', nextLine, breakLine);
    } catch (error) {
      console.error('GameDBContext/deleteAllGames/Error:', error, nextLine, breakLine);
    }
  };

  const generateGameId = (): string => {
    const gameId = uuidv4();
    return gameId;
  };

  const generateGamePin = async (gameId: string, category: string): Promise<string> => {
    try {
        if (!db) {
            throw new Error('SQLiteDB not initialized');
        }

        const shortenedGameId = gameId.replace(' ', '').substring(0, 4).toLowerCase();
        const shortenedCategory = category.replace(' ', '').substring(0, 4).toLowerCase();
        
        let newPin = `${shortenedCategory}${shortenedGameId}`;

        return newPin;
    } catch (error) {
        console.error('GameDBContext/generateGamePin/Error:', error, nextLine, breakLine);
        throw error;
    }
  };

  const getGamesByXML = async (): Promise<string> => {
  try {
    if (!db) {
      throw new Error('SQLiteDB not initialized');
    }

    const results = await db.getAllAsync<Game>(`SELECT * FROM games`);
    const gamesArray = [];

    for (let i = 0; i < results.length; i++) {
      const game = results[i];

      const questionsResult = await db.getAllAsync<Question>(`SELECT * FROM questions WHERE gameId = ?`, [game.gameId]);
      const questionsArray = [];

      for (let j = 0; j < questionsResult.length; j++) {
        const question = questionsResult[j];
        const answersResult = await db.getAllAsync<Answer>(`SELECT * FROM answers WHERE questionId = ?`, [question.questionId]);
        const answersArray = [];

        for (let k = 0; k < answersResult.length; k++) {
          const answer = answersResult[k];
          answersArray.push({
            text: answer.text,
            correctAnswer: answer.correctAnswer === 1,
          });
        }

        questionsArray.push({
          questionId: question.questionId,
          text: question.text,
          type: question.type,
          answers: { Answer: answersArray },
        });
      }

      const gameWithImage = {
        gameId: game.gameId,
        name: game.name,
        pin: game.pin,
        type: game.type,
        isPublic: game.isPublic === true,
        isPopular: game.isPopular === true,
        category: game.category,
        subCategory: game.subCategory,
        remark: game.remark,
        createdBy: game.createdBy,
        createdDate: game.createdDate,
        updatedBy: game.updatedBy,
        updatedDate: game.updatedDate,
        ts: game.ts,
        image: game.image,
        questions: { Question: questionsArray },
      };

      gamesArray.push(gameWithImage);
    }
    
    const builder = new Builder();
    const gamesXML = builder.buildObject({ Main: { Game: gamesArray } });

    return gamesXML;
  } catch (error) {
    console.error('GameDBContext/getGamesByXML/Error:', error, nextLine, breakLine);
    throw error;
  }
  };

  const loadGames = async (): Promise<any[]> => {
    try {
      if (!db) {
        throw new Error('SQLiteDB not initialized');
      }

      const results = await db.getAllAsync<Game>(`SELECT * FROM games`);
      const gamesArray = [];

      for (let i = 0; i < results.length; i++) {
        const game = results[i];

        const questionsResult = await db.getAllAsync<Question>(`SELECT * FROM questions WHERE gameId = ?`, [game.gameId]);
        const questionsArray = [];

        for (let j = 0; j < questionsResult.length; j++) {
          const question = questionsResult[j];
          const answersResult = await db.getAllAsync<Answer>(`SELECT * FROM answers WHERE questionId = ?`, [question.questionId]);
          const answersArray = [];

          for (let k = 0; k < answersResult.length; k++) {
            const answer = answersResult[k];
            answersArray.push({
              text: answer.text,
              correctAnswer: answer.correctAnswer === 1,
            });
          }

          questionsArray.push({
            questionId: question.questionId,
            text: question.text,
            type: question.type,
            answers: answersArray,
          });
        }

        const gameWithImage = {
          gameId: game.gameId,          name: game.name,          pin: game.pin,          type: game.type,
          isPublic: game.isPublic === true,
          isPopular: game.isPopular,          category: game.category,          subCategory: game.subCategory,
          remark: game.remark,          createdBy: game.createdBy,          createdDate: game.createdDate,
          updatedBy: game.updatedBy,          updatedDate: game.updatedDate,          ts: game.ts,
          image: game.image,           questions: questionsArray,
        };

        gamesArray.push(gameWithImage);
      }

      return gamesArray;
    } catch (error) {
      console.error('GameDBContext/loadGames/Error:', error, nextLine, breakLine);
      return [];
    }
  };

  const createGameByBatch = async (xmlData) => {
    try {
      parseString(xmlData, async (err, result) => {
        if (err) throw err;
  
        const games = result.Main.Game;
  
        for (const game of games) {
          const name = game.name[0];
          const type = game.type[0];
          const isPublic = game.isPublic[0] === 'true';
          const isPopular = game.isPopular[0] === 'false';
          const category = game.category[0];
          const subCategory = game.subCategory[0];
          const remark = game.remark[0];
          const createdBy = game.createdBy[0];
          const createdDate = game.createdDate ? game.createdDate[0] : null;
          const updatedBy = game.updatedBy[0];
          const updatedDate = game.updatedDate ? game.updatedDate[0] : null;
          const ts = game.ts ? game.ts[0] : null;
  
          const questions = game.Questions[0].Question.map((q) => ({
            text: q.text[0],
            type: q.type[0],
            answers: q.Answers[0].Answer.map((a) => ({
              text: a.text[0],
              correctAnswer: a.CorrectAnswer[0] === 'true',
            })),
            image: q.image ? q.image[0] : null,
          }));
  
          await createGame({
            name, type, isPublic, isPopular, category, subCategory, remark, createdBy, createdDate, updatedBy, updatedDate, ts, questions,
          });
        }
  
        //console.log("GameDBContext/createGameByBatch/Log: Batch game creation successful.", nextLine, breakLine);
      });
    } catch (error) {
      console.error("GameDBContext/createGameByBatch/Error:", error, nextLine, breakLine);
      throw error;
    }
  };

  const updateImageByPin = async (
    pin: string,    game_image: string | null,    q1_image: string | null,
    q2_image: string | null,    q3_image: string | null,    q4_image: string | null
  ): Promise<void> => {
    try {
      if (!db) {
        throw new Error('SQLiteDB not initialized');
      }

      await db.runAsync(
        `UPDATE games 
        SET image = ?, updatedDate = CURRENT_TIMESTAMP 
        WHERE pin = ?`,
        [game_image, pin]
      );

      if (q1_image) {
        await db.runAsync(
          `UPDATE questions 
          SET image = ?, updatedDate = CURRENT_TIMESTAMP 
          WHERE questionId IN (
            SELECT questionId FROM questions 
            WHERE gameId IN (
              SELECT gameId FROM games 
              WHERE pin = ?
            )
            LIMIT 1
          )`,
          [q1_image, pin]
        );
      }

      if (q2_image) {
        await db.runAsync(
          `UPDATE questions 
          SET image = ?, updatedDate = CURRENT_TIMESTAMP 
          WHERE questionId IN (
            SELECT questionId FROM questions 
            WHERE gameId IN (
              SELECT gameId FROM games 
              WHERE pin = ?
            )
            LIMIT 1 OFFSET 1
          )`,
          [q2_image, pin]
        );
      }

      if (q3_image) {
        await db.runAsync(
          `UPDATE questions 
          SET image = ?, updatedDate = CURRENT_TIMESTAMP 
          WHERE questionId IN (
            SELECT questionId FROM questions 
            WHERE gameId IN (
              SELECT gameId FROM games 
              WHERE pin = ?
            )
            LIMIT 1 OFFSET 2
          )`,
          [q3_image, pin]
        );
      }

      if (q4_image) {
        await db.runAsync(
          `UPDATE questions 
          SET image = ?, updatedDate = CURRENT_TIMESTAMP 
          WHERE questionId IN (
            SELECT questionId FROM questions 
            WHERE gameId IN (
              SELECT gameId FROM games 
              WHERE pin = ?
            )
            LIMIT 1 OFFSET 3
          )`,
          [q4_image, pin]
        );
      }

      console.log('GameDBContext/updateImageByPin/Log: Image updated successfully.', nextLine, breakLine);
    } catch (error) {
      console.error('GameDBContext/updateImageByPin/Error:', error, nextLine, breakLine);
      throw error;
    }
  };

  const searchGame = async (
    name: string,
    categories: string[],
    subcategory: string,
    createdBy: string
  ): Promise<any[]> => {
    try {
      if (!db) {
        throw new Error('SQLiteDB not initialized');
      }
  
      let query = `SELECT * FROM games WHERE 1`;      
  
      const params = [];
  
      if (name) {
        query += ` AND name LIKE ?`;
        params.push(`%${name}%`);
      }
  
      if (categories && categories.length > 0) {
        query += ` AND (`;
        categories.forEach((category, index) => {
          if (index > 0) query += ` OR `;
          query += `category = ?`;
          params.push(category);
        });
        query += `)`;
      }
  
      if (subcategory) {
        query += ` AND subCategory = ?`;
        params.push(subcategory);
      }
  
      if (createdBy) {
        query += ` AND createdBy = ?`;
        params.push(createdBy);
      }
  
      const results = await db.getAllAsync<Game>(query, params);
      const gamesArray = [];
  
      for (let i = 0; i < results.length; i++) {
        const game = results[i];
  
        const questionsResult = await db.getAllAsync<Question>(
          `SELECT * FROM questions WHERE gameId = ?`,
          [game.gameId]
        );
        const questionsArray = [];
  
        for (let j = 0; j < questionsResult.length; j++) {
          const question = questionsResult[j];
          const answersResult = await db.getAllAsync<Answer>(
            `SELECT * FROM answers WHERE questionId = ?`,
            [question.questionId]
          );
          const answersArray = [];
  
          for (let k = 0; k < answersResult.length; k++) {
            const answer = answersResult[k];
            answersArray.push({
              text: answer.text,
              correctAnswer: answer.correctAnswer === 1,
            });
          }
  
          questionsArray.push({
            questionId: question.questionId,
            text: question.text,
            type: question.type,
            answers: answersArray,
          });
        }
  
        const gameWithImage = {
          gameId: game.gameId,
          name: game.name,
          pin: game.pin,
          type: game.type,
          isPublic: game.isPublic === true,
          isPopular: game.isPopular,
          category: game.category,
          subCategory: game.subCategory,
          remark: game.remark,
          createdBy: game.createdBy,
          createdDate: game.createdDate,
          updatedBy: game.updatedBy,
          updatedDate: game.updatedDate,
          ts: game.ts,
          image: game.image,
          questions: questionsArray,
        };
  
        gamesArray.push(gameWithImage);
      }
  
      return gamesArray;
    } catch (error) {
      console.error('GameDBContext/searchGame/Error:', error);
      return [];
    }
  };
  
  
  const updateGameById = async (
    gameId: string,    name: string,    type: string,    isPublic: boolean,    isPopular: boolean,    category: string,
    subCategory: string,    remark: string,    updatedBy: string,    updatedDate: string,    image: string | null
  ): Promise<void> => {
    try {
      if (!db) {
        throw new Error('SQLiteDB not initialized');
      }

      await db.runAsync(
        `UPDATE games 
        SET name = ?, type = ?, isPublic = ?, isPopular = ?, category = ?, subCategory = ?, remark = ?, updatedBy = ?, updatedDate = ?, image = ?
        WHERE gameId = ?`,
        [name, type, isPublic ? 1 : 0, isPopular ? 1 : 0, category, subCategory, remark, updatedBy, updatedDate, image, gameId]
      );

      console.log('GameDBContext/updateGameById/Log: Game updated successfully.');
    } catch (error) {
      console.error('GameDBContext/updateGameById/Error:', error);
      throw error;
    }
  };

  const deleteGameById = async (gameId: string): Promise<void> => {
    try {
      if (!db) {
        throw new Error('SQLiteDB not initialized');
      }

      await db.runAsync(`DELETE FROM games WHERE gameId = ?`, [gameId]);
      await db.runAsync(`DELETE FROM questions WHERE gameId = ?`, [gameId]);
      await db.runAsync(`DELETE FROM answers WHERE questionId IN (SELECT questionId FROM questions WHERE gameId = ?)`, [gameId]);

      console.log('GameDBContext/deleteGameById/Log: Game deleted successfully.', nextLine, breakLine);
    } catch (error) {
      console.error('GameDBContext/deleteGameById/Error:', error, nextLine, breakLine);
      throw error;
    }
  };

  const deleteQuestionById = async (questionId: string): Promise<void> => {
    try {
      if (!db) {
        throw new Error('SQLiteDB not initialized');
      }

      await db.runAsync(`DELETE FROM questions WHERE questionId = ?`, [questionId]);
      await db.runAsync(`DELETE FROM answers WHERE questionId = ?`, [questionId]);

      console.log('GameDBContext/deleteQuestionById/Log: Question deleted successfully.', nextLine, breakLine);
    } catch (error) {
      console.error('GameDBContext/deleteQuestionById/Error:', error, nextLine, breakLine);
      throw error;
    }
  };

  const deleteAnswerById = async (answerId: string): Promise<void> => {
    try {
      if (!db) {
        throw new Error('Database not initialized');
      }

      await db.runAsync(`DELETE FROM answers WHERE answerId = ?`, [answerId]);

      console.log('GameDBContext/deleteAnswerById/Log: Answer deleted successfully.', nextLine, breakLine);
    } catch (error) {
      console.error('GameDBContext/deleteAnswerById/Error:', error, nextLine, breakLine);
      throw error;
    }
  };

  const createGameByExcel = async (data) => {
    try {
      // Split data into segments based on the specified markers
      const segments = data.split(/\s+(?=\[GAME_MARKER\]|\[GAMEHEADER_MARKER\]|\[QUESTIONCOLUMN_MARKER\]|\[QUESTIONROW_MARKER\])/);
  
      
      let gameName, gameType, gameCategory, gameSubCategory, gameRemark, gameImage, gameIsPopular;// Initialize variables to store game and question details
      let questions = [];
  
      for (const segment of segments) {
        const line = segment.trim();
        //console.log("segment", line);
  
        
        if (line.startsWith('[GAME_MARKER]')) {// When a new game marker is found, reset variables
          if (gameName && questions.length > 0) {
            
            const game = {// Create game object for the previous game
              gameId: gameImage,
              name: gameName,
              pin: gameImage,
              type: gameType,
              isPublic: false,
              isPopular: gameIsPopular === '1',
              category: gameCategory,
              subCategory: gameSubCategory,
              remark: gameRemark,
              image: gameImage,
              createdBy: 'System',
              createdDate: new Date().toISOString(),
              updatedBy: 'System',
              updatedDate: new Date().toISOString(),
              ts: new Date().toISOString(),
              questions: questions
            };
  
            const existingGame = await db.getAllAsync<Game>('SELECT * FROM games WHERE name = ? AND category = ?', [gameName, gameCategory]);
            if(existingGame.length > 0){
              deleteGameById(gameImage);
            }

            await createGame(game);
            //console.log('GameDBContext/createGameByExcel/Log: Game created successfully.');
          }  
           
          gameName = '';// Reset variables for the new game
          gameType = '';
          gameCategory = '';
          gameSubCategory = '';
          gameRemark = '';
          gameImage = '';
          gameIsPopular = '';
          questions = [];
        }
  
        
        if (line.startsWith('[GAMEHEADER_MARKER]')) {// Extract game header details
          const gameHeader = line.replace('[GAMEHEADER_MARKER]', '').split('\t').map(item => item.trim());
          gameName = gameHeader[1];
          gameRemark = gameHeader[2];
          gameCategory = gameHeader[3];
          gameImage = gameHeader[4];
          gameIsPopular = gameHeader[5];
        }  
        
        if (line.startsWith('[QUESTIONCOLUMN_MARKER]')) {
          continue;// Skip the question column header row
        }  
        
        if (line.startsWith('[QUESTIONROW_MARKER]')) {// Extract questions and answers
          const questionLine = line.replace('[QUESTIONROW_MARKER]', '');
          //console.log("questionLine", questionLine);
          questions = questions.concat(parseQuestions(questionLine));
        }
      }  
     
      if (gameName && questions.length > 0) { // Create game object for the last game in the data
        const game = {
          gameId: gameImage,
          name: gameName,
          pin: gameImage,
          type: gameType,
          isPublic: false,
          isPopular: gameIsPopular === '1',
          category: gameCategory,
          subCategory: gameSubCategory,
          remark: gameRemark,
          image: gameImage,
          createdBy: 'System',
          createdDate: new Date().toISOString(),
          updatedBy: 'System',
          updatedDate: new Date().toISOString(),
          ts: new Date().toISOString(),
          questions: questions
        };
  
        const existingGame = await db.getAllAsync<Game>('SELECT * FROM games WHERE name = ? AND category = ?', [gameName, gameCategory]);
        if(existingGame.length > 0){
            deleteGameById(gameImage);
        }

        await createGame(game);
        //console.log('GameDBContext/createGameByExcel/Log: Game created successfully.');
      }
  
      //await initDB();
    } catch (error) {
      console.error('GameDBContext/createGameByExcel/Error: ', error);
    }
  };
  
  const parseQuestions = (data) => {
    const lines = data.trim().split('\t');
    const questions = [];
  
    for (let i = 0; i < lines.length; i += 5) {
      const questionText = lines[i];
      const correctAnswer = lines[i + 1];
      const invalidAnswer1 = lines[i + 2];
      const invalidAnswer2 = lines[i + 3];
      const invalidAnswer3 = lines[i + 4];
  
      if (questionText && correctAnswer && invalidAnswer1 && invalidAnswer2 && invalidAnswer3) {
        const answers = [
          { text: correctAnswer, correctAnswer: true },
          { text: invalidAnswer1, correctAnswer: false },
          { text: invalidAnswer2, correctAnswer: false },
          { text: invalidAnswer3, correctAnswer: false },
        ];
  
        // Shuffle answers array
        shuffleArray(answers);
  
        questions.push({
          text: questionText,
          type: "Puzzle",
          answers: answers
        });
      }
    }
  
    return questions;
  };

  const shuffleArray = (array) => {// Function to shuffle the array
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const shuffleQuestions = (questions) => {    
    let currentIndex = questions.length, temporaryValue, randomIndex;
  
    while (0 !== currentIndex) {// Fisher-Yates algorithm
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      temporaryValue = questions[currentIndex];
      questions[currentIndex] = questions[randomIndex];
      questions[randomIndex] = temporaryValue;
    }
  
    return questions;
  };

  type PlayCountRecord = { date: string; user_id: string; count: number; };
  const checkDailyLimit = async (userId) => {
    const today = new Date().toISOString().split('T')[0];
    const result = await db.getAllAsync<PlayCountRecord>(`SELECT * FROM play_count WHERE date = ? AND user_id = ?`, [today, userId]);
    
    if (result.length > 0) {
      return result[0].count;
    } else {
      return 0;
    }
  };
  

  const incrementDailyPlayCount = async (userId) => {
    const today = new Date().toISOString().split('T')[0];
    const result = await db.getAllAsync<PlayCountRecord>(`SELECT * FROM play_count WHERE date = ? AND user_id = ?`, [today, userId]);
  
    if (result.length > 0) {
      const newCount = result[0].count + 1;
      await db.runAsync(`UPDATE play_count SET count = ?, updatedDate = CURRENT_TIMESTAMP WHERE date = ? AND user_id = ?`, [newCount, today, userId]);
    } else {
      await db.runAsync(`INSERT INTO play_count (date, count, user_id, createdDate) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`, [today, 1, userId]);
    }
  };
  
 
//#region Firebase ---------------------------------------------------------------------------------------------------------------------

const downloadGameFromFirebase = async () => {
  try {
      if (!db) {
        await initDB();
        //throw new Error('SQLiteDB not initialized');
      }  
     
      const gameRef = ref(database, 'downloadGame');
      const snapshot = await get(gameRef);
      const downloadedPackage = snapshot.val();
  
      if (downloadedPackage) {
        
        const versionsArray = Object.keys(downloadedPackage).map(key => downloadedPackage[key]);// Convert downloadedPackage to an array if it's an object
  
        for (const version of versionsArray) {
          const result = await db.getFirstAsync<{count: number}>('SELECT count(*) AS count FROM downloadVersion WHERE versionNo = ?', [version.versionNo]);
  
          if (result.count === 0) {
  
            await createGameByExcel(version.data);
            await db.runAsync('INSERT INTO downloadVersion (versionNo) VALUES (?)', [version.versionNo]);
          } else {
            console.log('GameDBContext/downloadGameFromFirebase/Log/: result != 0, reset data', nextLine, breakLine);
          }
        }
      } else {
        console.log('GameDBContext/downloadGameFromFirebase/Error: downloadedPackage is empty or invalid');
      }
  
      return downloadedPackage;
    } catch (error) {
      console.log('GameDBContext/downloadGameFromFirebase/Error:', error, breakLine, nextLine);
      //throw error;
    }
};

const initializeGameAsHost = async (gameState) => {
  try {
    
    const dataRef = ref(database, `GameState/${gameState.pin}`);    
    
    //console.log('gameState.gameId', gameState.gameId)
    const sqliteData = await loadGameById(gameState.gameId);
    //console.log('sqliteData:', sqliteData);

    const shuffledQuestions = shuffleQuestions(sqliteData.questions); // Shuffle questions

    const newGameState = {
      gameId: gameState.pin,
      name: sqliteData.name,
      pin: gameState.pin,
      type: 'multiplayer',
      players: gameState.players,
      currentQuestionIndex: 0,
      status: 'Active',
      questions: shuffledQuestions,
    };
    //console.log('newGameState', newGameState)

    await set(dataRef, newGameState);
    console.log('GameDBContext/updateGameStateInFirebase/Log: Game state inserted successfully in Firebase.');

    return newGameState;
  } catch (error) {
    console.error('Error initializing game as host:', error);
  }
};

const updateGameStateInFirebase = async (localGameState, isHost) => {
  try {
    const dataRef = ref(database, `GameState/${localGameState.gameId}`);

   
    const snapshot = await get(dataRef); // Check if the game exists
    const firebaseGameState = snapshot.val();
    
    const updatedGameState = {// Prepare updated game state
      ...firebaseGameState,
      currentQuestionIndex: isHost ? localGameState.currentQuestionIndex : firebaseGameState?.currentQuestionIndex || 0,
      status: isHost ? localGameState.status : firebaseGameState?.status || '',
      players: localGameState.players && firebaseGameState.players ? 
                mergePlayers(firebaseGameState.players, localGameState.players) : firebaseGameState.players,
    };

    await set(dataRef, updatedGameState);
    //console.log('Game state updated successfully in Firebase.');

  } catch (error) {
    console.error('Error updating game state in Firebase:', error);
    throw error;
  }
};


const mergePlayers = (existingPlayers, newPlayers) => {
  const mergedPlayers = [...existingPlayers];

  
  newPlayers.forEach(newPlayer => {// Add or update players' scores
    const existingPlayerIndex = mergedPlayers.findIndex(player => player.playerId === newPlayer.playerId);

    if (existingPlayerIndex !== -1) {      
      mergedPlayers[existingPlayerIndex] = { ...mergedPlayers[existingPlayerIndex], ...newPlayer };// Player exists in Firebase, update score
    } else {      
      mergedPlayers.push(newPlayer);// Player does not exist in Firebase, add new player
    }
  });
  
  const hostPlayerIndex = mergedPlayers.findIndex(player => player.playerType === 'host');// Ensure host player is added or updated
  const existingHostPlayer = existingPlayers.find(player => player.playerType === 'host');

  if (existingHostPlayer && hostPlayerIndex === -1) {
    mergedPlayers.push(existingHostPlayer);
  } else if (existingHostPlayer) {
    mergedPlayers[hostPlayerIndex] = { ...mergedPlayers[hostPlayerIndex], ...existingHostPlayer };
  }

  return mergedPlayers;
};





const fetchGameStateFromFirebase = async (gameState) => {
  try {    
    const dataRef = ref(database, `GameState/${gameState.gameId}`);
    const snapshot = await get(dataRef);
    const gameStateData = snapshot.val();

    return gameStateData;
  } catch (error) {
    console.error('Error fetching game data from Firebase:', error);
  }
};

//#endregion

  const contextValues: GameDBContextType = {
    db,
    createGame,    deleteAllGames,    generateGameId,    generateGamePin, getGamesByXML,        createGameByBatch,    
    updateImageByPin,    searchGame,    updateGameById,  initData_SQLite,

    loadGameByPin,    loadGameById,    loadGamesByCategory,    loadGames,      
    deleteGameById,    deleteQuestionById,     deleteAnswerById, 

    createGameByExcel,  loadGamesByDynamicColumn, checkDailyLimit, incrementDailyPlayCount,    
    updateGameStateInFirebase, downloadGameFromFirebase,initializeGameAsHost, fetchGameStateFromFirebase
  };

  return (
    <GameDBContext.Provider value={contextValues}>
    {children}
  </GameDBContext.Provider>
  );
};

export default GameDBProvider;


