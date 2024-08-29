import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { GameContext } from '../context/GameContext';
import { useGameDB } from '../utils/GameDBContext';

const PlayGameScreen = ({ navigation, route }) => {
  const { currentPlayerId } = route.params;
  const { gameState, setGameState } = useContext(GameContext);
  const { currentQuestionIndex, questions, players } = gameState;
  const [timer, setTimer] = useState(30);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const intervalRef = useRef(null);
  const { saveGame } = useGameDB();

  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalRef.current);
  }, [currentQuestionIndex]);

  const startTimer = () => {
    setTimer(30);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer === 1) {
          clearInterval(intervalRef.current);
          handleEndOfQuestion();
          return 10;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const handleAnswer = (option) => {
    setSelectedOption(option);
    clearInterval(intervalRef.current);

    const correctAnswer = questions[currentQuestionIndex]?.answers.find(a => a.correctAnswer === true)?.text?.toLowerCase();
    const selectedText = option.text.toLowerCase().trim();
    const isCorrect = selectedText === correctAnswer;

    setGameState(prevState => ({
      ...prevState,
      players: prevState.players.map(p => {
        if (p.playerId === currentPlayerId) {
          return {
            ...p,
            score: p.score + (isCorrect ? 1 : 0)
          };
        }
        return p;
      })
    }));
    
    randomGiveScoreToBot();// Randomly give score to a bot player
    setShowResults(true);
    setShowNextButton(true);
  };

  const handleNextQuestion = () => {
    setShowResults(false);
    setShowNextButton(false);
    setSelectedOption(null);
    if (currentQuestionIndex < questions.length - 1) {
      setGameState(prevState => ({
        ...prevState,
        currentQuestionIndex: prevState.currentQuestionIndex + 1
      }));
    } else {
      navigation.navigate('FinalResult');
    }
  };

  const handleEndOfQuestion = () => {
    setShowResults(true);
    setShowNextButton(true);
  };

   // Function to randomly give score to a bot player
   const randomGiveScoreToBot = () => {
    const botPlayers = players.filter(player => player.playerType === 'Bot');
    if (botPlayers.length > 0) {
      const randomBotIndex = Math.floor(Math.random() * botPlayers.length);
      const botPlayer = botPlayers[randomBotIndex];
      setGameState(prevState => ({
        ...prevState,
        players: prevState.players.map(p => {
          if (p.playerId === botPlayer.playerId) {
            return {
              ...p,
              score: p.score + 1
            };
          }
          return p;
        })
      }));
    }
  };

  const topPlayers = [...players].sort((a, b) => b.score - a.score).slice(0, 3);

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
      <View style={styles.header}>
        <Text style={styles.pageNumber}>📄 {currentQuestionIndex + 1}/{questions.length}</Text>
        <Text style={styles.timerText}>⏰ {timer} sec</Text>
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
      {showResults && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={showResults}
          onRequestClose={() => setShowResults(false)}
        >
          <View style={styles.overlay}>
            <View style={styles.resultsContainer}>
              <Text style={[
                styles.feedbackText,
                { color: selectedOption?.text === questions[currentQuestionIndex]?.answers.find(a => a.correctAnswer)?.text ? 'green' : 'red' }
              ]}>
                {selectedOption?.text === questions[currentQuestionIndex]?.answers.find(a => a.correctAnswer)?.text ? '👍Correct👍' : '❌Wrong❌'}
              </Text>
              <Text style={styles.resultsTitle}>Top 3 Players</Text>
              {topPlayers.map((player, index) => (
                <View key={index} style={styles.playerRow}>
                  <Text style={styles.playerCharacter}>{player.character}</Text>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.playerScore}>[{player.score}]</Text>
                </View>
              ))}
              {showNextButton && (
                <TouchableOpacity onPress={handleNextQuestion} style={styles.nextButton}>
                  <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 7,//11
    backgroundColor: '#FFF9C4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,//16
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
    marginBottom: 10,
    paddingHorizontal: 5, // Add some horizontal padding
  },
  question: {
    fontSize: 22.5, //30
    fontWeight: 'bold', 
    textAlign: 'center',
    flexWrap: 'wrap',
    flexShrink: 1,
    //lineHeight: 40, // Adjust line height for readability
  },
  answersContainer: {
    width: '100%',
    marginBottom: 7,//16
  },
  answerButton: {
    padding: 20,
    borderRadius: 10,
    marginVertical: 9,//10
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
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  },
  playerCharacter: {
    fontSize: 50,
    textAlign: 'left',
    marginRight: 10,
    color: '#ff4500',
    fontWeight: 'bold',
  },
  playerName: {
    fontSize: 25,
    textAlign: 'left',
    flex: 1,
  },
  playerScore: {
    fontSize: 25,
    textAlign: 'left',
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
});

export default PlayGameScreen;