import React, { useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { GameContext } from '../context/GameContext';

const FinalResultScreen = ({ navigation }) => {
  const { gameState } = useContext(GameContext);
  const { players } = gameState;

  const top3Players = players.sort((a, b) => b.score - a.score).slice(0, 3);  

  // Animation for the trophy
  const bounceAnim = useRef(new Animated.Value(0)).current;

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Final Results</Text>
      <View style={styles.podium}>
        {top3Players[2] && (
          <TouchableOpacity style={[styles.podiumPlace, styles.thirdPlace]}>
            <Text style={styles.podiumCharacter}>{top3Players[2].character}</Text>
            <Text style={styles.podiumText}>3rd</Text>
            <Text style={styles.podiumName}>{top3Players[2].name}</Text>
            <Text style={styles.podiumScore}>{top3Players[2].score}</Text>
          </TouchableOpacity>
        )}
        {top3Players[0] && (
          <View style={styles.firstPlaceContainer}>
            <Animated.Text style={[styles.trophy, { transform: [{ translateY: bounceAnim }] }]}>🏆</Animated.Text>
            <TouchableOpacity style={[styles.podiumPlace, styles.firstPlace]}>
              <Text style={styles.podiumCharacter}>{top3Players[0].character}</Text>
              <Text style={styles.podiumText}>1st</Text>
              <Text style={styles.podiumName}>{top3Players[0].name}</Text>
              <Text style={styles.podiumScore}>{top3Players[0].score}</Text>
            </TouchableOpacity>
          </View>
        )}
        {top3Players[1] && (
          <TouchableOpacity style={[styles.podiumPlace, styles.secondPlace]}>
            <Text style={styles.podiumCharacter}>{top3Players[1].character}</Text>
            <Text style={styles.podiumText}>2nd</Text>
            <Text style={styles.podiumName}>{top3Players[1].name}</Text>
            <Text style={styles.podiumScore}>{top3Players[1].score}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9C4', // light yellow
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 34, // Increased font size for visibility
    fontWeight: 'bold', // Make the text bold
    marginBottom: 20,
    marginTop: 40, // Adjust margin to position it higher
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
    fontWeight: 'bold', // Make text bold
  },
  podiumName: {
    fontSize: 18,
    fontWeight: 'bold', // Make text bold
  },
  podiumScore: {
    fontSize: 16,
    fontWeight: 'bold', // Make text bold
  },
  podiumCharacter: {
    fontSize: 60,
    color: '#000', // Make the character color more visible
    fontWeight: 'bold', // Make text bold
  },
  trophy: {
    fontSize: 60, // Increased font size for better visibility
    color: '#FFD700', // Bright gold color
    fontWeight: 'bold', // Make the text bold
    textShadowColor: '#000', // Add a shadow for better contrast
    textShadowOffset: { width: 2, height: 2 }, // Offset the shadow
    textShadowRadius: 1, // Blur the shadow
    textAlign: 'center', // Center align the text
  },
  firstPlaceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  firstPlace: {
    height: '70%',
    backgroundColor: 'purple',//'#ffd700',
    width: '100%', // Ensure full width
  },
  secondPlace: {
    height: '60%',
    backgroundColor: '#c0c0c0',
  },
  thirdPlace: {
    height: '50%',
    backgroundColor: '#cd7f32',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default FinalResultScreen;
