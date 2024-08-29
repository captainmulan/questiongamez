import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { GameContext } from '../context/GameContext';
import { useGameDB } from '../utils/GameDBContext';

const LoadingPlayerScreen = ({ route, navigation }) => {
  const { gameId, pin, playerName } = route.params;
  const { gameState, setGameState, shuffleArray } = useContext(GameContext);
  const { loadGameByPin, loadGameById } = useGameDB();
  const [selectedCharacter, setSelectedCharacter] = useState('🤴');
  const [character, setCharacter] = useState(selectedCharacter);
  const currentPlayerId = gameState.players.find(player => player.name === playerName)?.playerId || Math.random().toString(36).substr(2, 9);

  const nextLine = '\n';
  const breakLine = '-------------------------------------------------------------------------------------------------------------------------------------------------------------';

  const initialPlayers = [
    { name: playerName, playerId: currentPlayerId, character, score: 0, playerType: 'User'},
    { name: 'Ethan', playerId: Math.random().toString(36).substr(2, 9), character: '🐒', score: 0, playerType: 'Bot' },
    { name: 'Joy', playerId: Math.random().toString(36).substr(2, 9), character: '🐧', score: 0, playerType: 'Bot' },
  ];

  const characters = ['🤴', '👸', '🦄', '🐒', '🐶', '🐯', '🦁', '🐰', '🐧', '🐱', '🐘', ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      //const data = await loadGameByPin(pin, false, true, true, false);
      const data = await loadGameById(gameId);
      if (data) {
        //const shuffledQuestions = shuffleQuestions(data.questions); // Shuffle questions
        const shuffledQuestions = shuffleArray(data.questions); // Shuffle questions
        setGameState(prevState => {
          const isPlayerExist = prevState.players.some(player => player.playerId === currentPlayerId);
          const newPlayers = isPlayerExist ? prevState.players : [...prevState.players, ...initialPlayers];
          return {
            ...prevState,
            currentQuestionIndex: 0,
            gameId: gameId,
            status: 'active',
            pin,
            name: data.name,
            type: data.type,
            questions: shuffledQuestions,
            //answers: data.answers,
            players: newPlayers,
          };
        });
      }
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  };

  const handleCharacterChange = (char) => {
    setCharacter(char);
    setGameState(prevState => {
      const updatedPlayers = prevState.players.map(player => 
        player.playerId === currentPlayerId ? { ...player, character: char } : player
      );
      return { ...prevState, players: updatedPlayers };
    });
  };

  const handlePlay = () => {
    //navigation.navigate('PlayGame', { playerId: currentPlayerId });
    navigation.navigate('PlayGame', { currentPlayerId: currentPlayerId });
    //console.log('LoadingPlayerScreen/handlePlay/Log: currentPlayerId:', currentPlayerId, nextLine, breakLine);
  };

  // const shuffleQuestions = (questions) => {    
  //   let currentIndex = questions.length, temporaryValue, randomIndex;
  
  //   while (0 !== currentIndex) {// Fisher-Yates algorithm
  //     randomIndex = Math.floor(Math.random() * currentIndex);
  //     currentIndex -= 1;
  
  //     temporaryValue = questions[currentIndex];
  //     questions[currentIndex] = questions[randomIndex];
  //     questions[randomIndex] = temporaryValue;
  //   }
  
  //   return questions;
  // };

  return (
    <View style={styles.container}>
      <ScrollView vertical>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Your Profile</Text>
        <View style={styles.profileRow}>
          <Text style={styles.characterLarge}>{character}</Text>
          <Text style={styles.profileText}>{playerName}</Text>
        </View>
      </View>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Choose Character</Text>
        <View style={styles.characterRow}>
          <ScrollView horizontal>
            <View style={styles.characterRow}>
              {characters.map((char, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleCharacterChange(char)}
                  style={[
                    styles.characterButton,
                    char === character && styles.selectedCharacterButton,
                  ]}
                >
                  <Text style={[styles.character, char === character && styles.selectedCharacter]}>
                    {char}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Game Lobby</Text>
        <ScrollView horizontal>
          <View style={styles.lobbyContainer}>
            {gameState.players.map((player, index) => (
              <View key={player.playerId} style={styles.lobbyPlayer}>
                <Text style={styles.characterLarge}>{player.character}</Text>
                <Text style={styles.lobbyText}>{player.name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
        <Text style={styles.playButtonText}>Play</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 18,//20
    backgroundColor: '#FFF8DC',
  },
  panel: {
    marginVertical: 8,//10
    padding: 8.5,//15
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  panelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  characterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
  characterButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#e9ecef',
  },
  selectedCharacterButton: {
    backgroundColor: '#007bff',
  },

  characterLarge: {
    fontSize: 60, // Increased size for better visibility
    marginRight: 10,
    fontWeight: 'bold',
    color: '#ff4500', // Bright orange color for vibrancy
  },
  character: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000', // Black for better contrast
  },
  selectedCharacter: {
    color: '#fff',
    fontWeight: 'bold',
  },
  profileText: {
    fontSize: 24, // Increased size for better visibility
    fontWeight: 'bold',
    color: '#000', // Black for better contrast
  },
  lobbyText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000', // Black for better contrast
  },
  
  lobbyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  lobbyPlayer: {
    width: 100,
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 10,
  },
  playButton: {
    padding: 15,
    backgroundColor: '#3AA6B9',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default LoadingPlayerScreen;
