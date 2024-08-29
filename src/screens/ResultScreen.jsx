import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameContext } from '../context/GameContext';

const ResultScreen = ({ navigation }) => {
  const { gameState } = useContext(GameContext);
  const { players = [], currentQuestionIndex, questions, selectedAnswer } = gameState;
  const isGameOver = currentQuestionIndex >= questions.length;

  const [timer, setTimer] = useState(isGameOver ? 20 : 5);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer === 1) {
          clearInterval(interval);
          if (isGameOver) {
            navigation.navigate('Home');
          } else {
            navigation.navigate('PlayGame');
          }
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameOver, navigation]);

  const calculateIsCorrectAnswer = () => {
    if (selectedAnswer === null) return null; // Handle case when no answer is selected
    return selectedAnswer === questions[currentQuestionIndex].answer;
  };

  const isCorrectAnswer = calculateIsCorrectAnswer();

  const top5Players = players
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <View style={styles.container}>
      {isGameOver ? (
        <>
          <Text style={styles.title}>Final Results</Text>
          <View style={styles.podium}>
            {/* Remaining JSX for final results */}
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>Current Rankings</Text>
          {isCorrectAnswer !== undefined && (
            <Text style={[styles.answerText, { color: isCorrectAnswer ? 'green' : 'red' }]}>
              {isCorrectAnswer ? 'Correct' : 'Wrong'}
            </Text>
          )}
          {top5Players.map((player, index) => (
            <View key={index} style={styles.player}>
              <Text style={styles.rank}>{index + 1}</Text>
              <Text style={styles.name}>{player.name}</Text>
              <Text style={styles.score}>{player.score}</Text>
            </View>
          ))}
        </>
      )}
      <Text style={styles.timerText}>Next in {timer} seconds</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  player: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 18,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
    height: '50%',
  },
  timerText: {
    marginTop: 20,
    fontSize: 18,
    color: '#888',
  },
  answerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ResultScreen;
