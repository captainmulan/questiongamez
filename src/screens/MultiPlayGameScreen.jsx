import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Animated } from 'react-native';
import { GameContext } from '../context/GameContext';
import { useGameDB } from '../utils/GameDBContext';
//import FinalResultComponent from '../components/FinalResultComponent';
// import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, get, update, remove } from 'firebase/database';
import { database } from '../config/firebaseConfig';

const MultiPlayGameScreen = ({ navigation, route  }) => {  
  const { gameId, currentPlayerId, isHostPlayer} = route.params;

  const { gameState, setGameState } = useContext(GameContext);
  const { currentQuestionIndex = 0, questions = [], players = [] } = gameState;
  const [mainTimer, setMainTimer] = useState(mainTimerConfig);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [loadingSubResult, setLoadingSubResult] = useState(false);
  const [loadingFinalResult, setLoadingFinalResult] = useState(false);
  const [subResultData, setSubResultData] = useState([]); // Data for sub result modal
  const [finalResultData, setFinalResultData] = useState([]); // Data for final result modal
  // const { updateGameStateInFirebase } = useGameDB();
  const mainTimerConfig = 12; 

  const intervalRef = useRef(null);
  const modalIntervalRef = useRef(null);
  //const gameStateRef = useRef(gameState);
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const nextLine = '\n';
  const breakLine = '-------------------------------------------------------------------------------------------------------------------------------------------------------------';

  // const firebaseConfig = {
  //   apiKey: "AIzaSyD3SeWV2APudbyGa8dvdUdgzeGOx23KLx4",
  //   authDomain: "questiongame-19fd2.firebaseapp.com",
  //   databaseURL: "https://questiongame-19fd2-default-rtdb.asia-southeast1.firebasedatabase.app",
  //   projectId: "questiongame-19fd2",
  //   storageBucket: "questiongame-19fd2.appspot.com",
  //   messagingSenderId: "304301212730",
  //   appId: "1:304301212730:android:5780c9bed6f52a4a69a103"
  // };

  useEffect(() => {    
    startTimer();
    return () => clearInterval(intervalRef.current);
  }, [currentQuestionIndex]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -20,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceAnim]);

  const startTimer = () => {
    setMainTimer(mainTimerConfig);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setMainTimer(prevTimer => {
        if (prevTimer === 1) {
          clearInterval(intervalRef.current);
          handleEndOfQuestion();
          return mainTimerConfig;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };  

  const handleAnswer = async (option) => {
    setSelectedOption(option);
    const correctAnswer = questions[currentQuestionIndex]?.answers.find(a => a.correctAnswer)?.text?.toLowerCase();
    const selectedText = option.text.toLowerCase().trim();
    const isCorrect = selectedText === correctAnswer;

    const firebaseGameState = await fetchGameStateFromFirebase();
  
    // Ensure firebasePlayers is defined and is an object
    console.log("gameId/firebasePlayers", gameId, firebaseGameState.players)
    await updateScoreInFirebase(firebaseGameState.players, currentPlayerId, isCorrect ? 1 : 0);

    console.log("handleAnswer/isHostPlayer/currentPlayerId/isCorrect: ", isHostPlayer, currentPlayerId, isCorrect);
    
  };

  const handleEndOfQuestion = () => {
    setLoadingSubResult(true);

    setTimeout(async () => {
      try {
        const updatedGameState = await fetchGameStateFromFirebase(gameId);
       
        setGameState(updatedGameState);
        console.log("handleEndOfQuestion/currentQuestionIndex: ", currentQuestionIndex);

        setSubResultData(updatedGameState.players || []);
        setLoadingSubResult(false);
        setShowResults(true);
        startModalTimer();
      } catch (error) {
        console.error('Error fetching sub game state:', error);
      }
    }, 3000); // Show loading for 3 seconds before showing final result modal
  };


  const handleNextQuestion = async () => {
    setShowResults(false);
    setSelectedOption(null);

    if (currentQuestionIndex < questions.length - 1) {
      const newIndex = currentQuestionIndex + 1;

      if (isHostPlayer) {      
        
        updateCurrentQuestionIndexInFirebase(newIndex);
      }    

      // // gameStateRef.current = {
      // //   ...gameStateRef.current,
      // //   currentQuestionIndex: newIndex,
      // // };

        setGameState({
        ...gameState,
        currentQuestionIndex: newIndex,
      });

      // updateScoreInFirebase();
    } else {

      console.log("handleNextQuestion: ","Final")
      clearInterval(intervalRef.current);
      clearInterval(modalIntervalRef.current);

      const firebaseGameState = await fetchGameStateFromFirebase();

      await updateScoreInFirebase(firebaseGameState.players);

      setLoadingFinalResult(true);
      setTimeout(async () => {
        try {
          const updatedGameState = await fetchGameStateFromFirebase();
          // console.log("handleNextQuestion/updatedGameState: ", updatedGameState)
          setFinalResultData(updatedGameState.players || []);
          setLoadingFinalResult(false);
          setShowFinalResult(true);
        } catch (error) {
          console.error('Error fetching final game state:', error);
        }
      }, 3000); // Show loading for 3 seconds before showing final result modal
    }
  };

  const handleGoBack = async () => {
    await deleteGameStateFromFirebase();

    const emptyGameState = {
    currentQuestionIndex: 0,
    gameId: '',
    status: '',
    pin: '',
    name: '',
    type: '',
    questions: [],    
    players: [],
    };

    setGameState(emptyGameState);
    navigation.navigate('Home');
  }

  const updateCurrentQuestionIndexInFirebase = async (newIndex) => {
    try {
      // const app = initializeApp(firebaseConfig);
      // const database = getDatabase(app);
      const gameRef = ref(database, `GameState/${gameId}/currentQuestionIndex`);
  
      await set(gameRef, newIndex); // Use set() to update currentQuestionIndex
  
      console.log(`Updated currentQuestionIndex to ${newIndex}`);
    } catch (error) {
      console.error('Error updating currentQuestionIndex in Firebase:', error);
    }
  };
  

  const updateScoreInFirebase = async (firebasePlayers, currentPlayerId, scoreToAdd) => {
    try {

      const updates = {};

      console.log("firebasePlayers", firebasePlayers);
      
      if (typeof firebasePlayers === 'object' && firebasePlayers !== null) {
        // Iterate over the keys of the firebasePlayers object (assuming it's an object with keys like "2d05i5thi")
        Object.keys(firebasePlayers).forEach(playerId => {
          // Calculate new score by adding scoreToAdd to the current score
          const firebasePlayerId = firebasePlayers[playerId].playerId;
          const currentScore = firebasePlayers[playerId].score || 0; // Default to 0 if score is undefined
          const newScore = currentScore + scoreToAdd;

          console.log("firebasePlayerId/currentScore/newScore",firebasePlayerId, currentScore, newScore)
  
          // Update score for each player to the new value
          if (firebasePlayerId == currentPlayerId) {
            console.log("playerfound", currentPlayerId);
            updates[`GameState/${gameId}/players/${playerId}/score`] = newScore;
          }
        });
  
        // Perform the batch update
        await update(ref(database), updates);
        console.log("Score updated")
      } else {
        console.error('Players data is not an object:', players);
      }
    } catch (error) {
      console.error('Error updating scores in Firebase:', error);
    }
  };
   

  const fetchGameStateFromFirebase = async () => {
    try {

      console.log("gameId", gameId);
      const gameStateRef = ref(database, `GameState/${gameId}`);
      const snapshot = await get(gameStateRef);
      //console.log("snapshot", snapshot);

      if (snapshot.exists()) {
        //return snapshot.val();
        const gameState = snapshot.val();
        //console.log("gameState.players", gameState.players);

      // Check if the gameState has a players array and sort it by score
      if (gameState.players && Array.isArray(gameState.players)) {
        gameState.players.sort((a, b) => b.score - a.score);
      }

      return gameState;
      } else {
        console.log('No data available');
        return {};
      }
    } catch (error) {
      console.error('Error fetching game state from Firebase:', error);
      return {};
    }
  };

  const deleteGameStateFromFirebase = async () => {
    try {
      // const app = initializeApp(firebaseConfig);
      // const database = getDatabase(app);
      const gameStateRef = ref(database, `GameState/${gameId}`);
      const snapshot = await get(gameStateRef);
  
      if (snapshot.exists()) {
        await remove(gameStateRef);
        //console.log('MultiPlayGameScreen/deleteGameStateFromFirebase/Log: Game state deleted successfully', nextLine, breakLine);
      } else {
        //console.log('MultiPlayGameScreen/deleteGameStateFromFirebase/Log: No data available', nextLine, breakLine);
      }
    } catch (error) {
      console.error('MultiPlayGameScreen/deleteGameStateFromFirebase/Log: Error fetching game state from Firebase:', error, nextLine, breakLine);
    }
  };
  

  const startModalTimer = () => {
    let modalTimer = 5; // Initial timer value for modal
    modalIntervalRef.current = setInterval(() => {
      modalTimer--;
      if (modalTimer === 0) {
        clearInterval(modalIntervalRef.current);
        handleNextQuestion();
      }
    }, 1000);
  };

  if (!questions[currentQuestionIndex]) {
    return (
      <View style={styles.container}>
        <Text style={styles.question}>No questions available</Text>
      </View>
    );
  }

  const questionText = questions[currentQuestionIndex]?.text;

  return (
    <View style={styles.container}>
          {loadingSubResult || loadingFinalResult ? (
      <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
    ) : (
      <>

      <View style={styles.header}>
        <Text style={styles.pageNumber}>📄 {currentQuestionIndex + 1}/{questions.length}</Text>
        <Text style={styles.timerText}>⏰ {mainTimer} sec</Text>
      </View>
      <View style={styles.questionContainer}>
        <Text style={styles.question}>{questionText}</Text>
      </View>
      <View style={styles.answersContainer}>
        {questions[currentQuestionIndex]?.type === 'TrueFalse' ? (
          <View style={{ width: '100%' }}>
            <TouchableOpacity
              style={[
                styles.answerButton,
                styles.answerButton1,
                selectedOption?.text === 'True' && { opacity: 0.7 }
              ]}
              onPress={() => handleAnswer({ text: 'True' })}
              disabled={!!selectedOption}
            >
              <Text style={styles.answerText}>⭕  True</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.answerButton,
                styles.answerButton2,
                selectedOption?.text === 'False' && { opacity: 0.7 }
              ]}
              onPress={() => handleAnswer({ text: 'False' })}
              disabled={!!selectedOption}
            >
              <Text style={styles.answerText}>❌  False</Text>
            </TouchableOpacity>
          </View>
        ) : (
          questions[currentQuestionIndex]?.answers?.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.answerButton,
                index === 0 ? styles.answerButton1 :
                  index === 1 ? styles.answerButton2 :
                    index === 2 ? styles.answerButton3 :
                      index === 3 ? styles.answerButton4 :
                        styles.answerButton,
                selectedOption?.text === option.text && { opacity: 0.7 }
              ]}
              onPress={() => handleAnswer(option)}
              disabled={!!selectedOption}
            >
              <Text style={styles.answerText}>{option.text}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
      </>
    )}


<Modal
  visible={showResults}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setShowResults(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.resultsContainer}>
      {loadingSubResult ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text
            style={[
              styles.feedbackText,
              {
                color:
                  selectedOption?.text ===
                  questions[currentQuestionIndex]?.answers.find(
                    (a) => a.correctAnswer
                  )?.text
                    ? 'green'
                    : 'red',
              },
            ]}
          >
            {selectedOption?.text ===
            questions[currentQuestionIndex]?.answers.find(
              (a) => a.correctAnswer
            )?.text
              ? '👍Correct👍'
              : '❌Wrong❌'}
          </Text>
          <Text style={styles.resultsTitle}>Players Ranking</Text>
          {subResultData.map((player, index) => (
            <View key={index} style={styles.playerScoreRow}>
              <Text style={styles.playerCharacter}>{player.character}</Text>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerScore}>[{player.score}]</Text>
            </View>
          ))}
          
        </>
      )}
    </View>
  </View>
</Modal>



<Modal visible={showFinalResult} transparent={true} animationType="slide">
  <View style={styles.modalContainer}>
    <View style={styles.resultsContainer}>
      {loadingFinalResult ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.modalTitle}>Final Results</Text>
          <View style={styles.podium}>
            {finalResultData[2] && (
              <TouchableOpacity style={[styles.podiumPlace, styles.thirdPlace]}>
                <Text style={styles.podiumCharacter}>{finalResultData[2].character}</Text>
                <Text style={styles.podiumText}>3rd</Text>
                <Text style={styles.podiumName}>{finalResultData[2].name}</Text>
                <Text style={styles.podiumScore}>{finalResultData[2].score}</Text>
              </TouchableOpacity>
            )}
            {finalResultData[0] && (
              <View style={styles.firstPlaceContainer}>
                <Animated.Text style={[styles.trophy, { transform: [{ translateY: bounceAnim }] }]}>🏆</Animated.Text>
                <TouchableOpacity style={[styles.podiumPlace, styles.firstPlace]}>
                  <Text style={styles.podiumCharacter}>{finalResultData[0].character}</Text>
                  <Text style={styles.podiumText}>1st</Text>
                  <Text style={styles.podiumName}>{finalResultData[0].name}</Text>
                  <Text style={styles.podiumScore}>{finalResultData[0].score}</Text>
                </TouchableOpacity>
              </View>
            )}
            {finalResultData[1] && (
              <TouchableOpacity style={[styles.podiumPlace, styles.secondPlace]}>
                <Text style={styles.podiumCharacter}>{finalResultData[1].character}</Text>
                <Text style={styles.podiumText}>2nd</Text>
                <Text style={styles.podiumName}>{finalResultData[1].name}</Text>
                <Text style={styles.podiumScore}>{finalResultData[1].score}</Text>
              </TouchableOpacity>
            )}
          </View>
          {finalResultData.map((player, index) => (
            <View key={index} style={styles.playerScoreRow}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerScore}>[{player.score}]</Text>
            </View>
          ))}
        </>
      )}
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>





    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 7, //16//-10
    backgroundColor: '#FFF9C4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,//16,
  },
  pageNumber: {
    fontSize: 24,
    color: '#6c757d',
  },
  timerText: {
    fontSize: 24,
    color: '#6c757d',
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, //16
    paddingHorizontal: 5, // Add some horizontal padding
  },
  question: {
    fontSize: 22.5,
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  answersContainer: {
    width: '100%',
    justifyContent: 'center',
    marginBottom: 7,
  },
  answerButton: {
    padding: 20,
    borderRadius: 10,
    marginVertical: 9,
    width: '100%',
    alignItems: 'center',
  },
  answerButton1: {
    backgroundColor: '#90EE90',
  },
  answerButton2: {
    backgroundColor: '#c0c0c0',
  },
  answerButton3: {
    backgroundColor: '#cd7f32',
  },
  answerButton4: {
    backgroundColor: 'purple',
  },
  answerText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#000', // Make the character color more visible
    fontWeight: 'bold', // Make text bold
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  playerScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 5,
  },
  playerName: {
    fontSize: 18,
  },
  playerScore: {
    fontSize: 18,
  },
  resultsContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 28,
    marginBottom: 16,
    textAlign: 'center',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'green',
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 4,
    width: '100%',

    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // width: '100%',
    // marginVertical: 5,
  },
  playerCharacter: {
    fontSize: 50,
    textAlign: 'left',
    marginRight: 10,
    color: '#ff4500',
    fontWeight: 'bold',
  },
  nextButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#28a745',
    borderRadius: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 20,
  },

  podium: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    height: '50%',
    marginBottom: 20,
  },
  podiumPlace: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#eee',
    paddingVertical: 10,
  },
  podiumText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  podiumName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  podiumScore: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  podiumCharacter: {
    fontSize: 60,
    color: '#000',
    fontWeight: 'bold',
  },
  trophy: {
    fontSize: 60,
    color: '#FFD700',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    textAlign: 'center',
  },
  firstPlaceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  firstPlace: {
    height: '70%',
    backgroundColor: 'purple',
    width: '100%',
  },
  secondPlace: {
    height: '60%',
    backgroundColor: '#c0c0c0',
  },
  thirdPlace: {
    height: '50%',
    backgroundColor: '#cd7f32',
  },
  // playerScoreRow: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   width: '100%',
  //   marginVertical: 5,
  // },
  playerName: {
    fontSize: 18,
  },
  playerScore: {
    fontSize: 18,
  },
  backButton: {
    //position: 'absolute',
    top: 90,
    left: 'center',
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 30,
    color: '#0000ff',
  },

});


export default MultiPlayGameScreen;
