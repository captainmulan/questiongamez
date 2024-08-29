import React, { createContext, useState } from 'react';
import { useGameDB } from '../utils/GameDBContext';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const { addPlayer_Firebase } = useGameDB();
  const [gameState, setGameState] = useState({
    currentQuestionIndex: 0,
    gameId: '',
    status: '',
    pin: '',
    name: '',
    type: '',
    questions: [],    
    players: [],    
  });
  const characters = ['🤴', '👸', '🦄', '🐒', '🐶', '🐯', '🦁', '🐰', '🐧', '🐱', '🐘'];

  const addPlayer = (gameId, playerName, character = '', playerId) => {
    setGameState(prevState => {
      // Check if the player already exists
      const playerExists = prevState.players.some(player => player.playerId === playerId);
      
      // If the player already exists, return the previous state
      if (playerExists) {
        return prevState;
      }
      
      // Otherwise, add the new player to the list
      const updatedPlayers = [
        ...prevState.players,
        { playerName, character, playerId, score: 0 }
      ];

      return {
        ...prevState,
        players: updatedPlayers
      };
    });

    // Uncomment the line below if you need to sync with Firebase
    // addPlayer_Firebase(gameId, playerName, character);
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

  const shuffleArray = (inputArray) => {    
    let currentIndex = inputArray.length, temporaryValue, randomIndex;
  
    while (0 !== currentIndex) {// Fisher-Yates algorithm
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      temporaryValue = inputArray[currentIndex];
      inputArray[currentIndex] = inputArray[randomIndex];
      inputArray[randomIndex] = temporaryValue;
    }
  
    return inputArray;
  };

  return (
    <GameContext.Provider value={{ gameState, setGameState, characters, shuffleQuestions, shuffleArray }}>
      {children}
    </GameContext.Provider>
  );
};
