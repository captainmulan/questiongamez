import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert  } from 'react-native';
import { GameContext } from '../context/GameContext';
import { useGameDB } from '../utils/GameDBContext';

const JoinGameScreen = ({ navigation }) => {
  const [playerName, setPlayerName] = useState('');
  const [pin, setPin] = useState('');
  const [selectedCharacter] = useState('🤴');
  const [character, setCharacter] = useState(selectedCharacter);
  const { fetchGameStateFromFirebase } = useGameDB();
  const { setGameState, characters } = useContext(GameContext);

  // const characters = ['🤴', '👸', '🦄', '🐒', '🐶', '🐯', '🦁', '🐰', '🐧', '🐱', '🐘'];

  const handleCharacterChange = (char) => {
    setCharacter(char);
  };

  const joinGame = async () => {
    try{
    
    if (playerName.trim() && pin.trim()) {
      //const data = await loadGameByPin(pin.slice(0, -2), false, true, true, false);

      const firebaseGameState = await fetchGameStateFromFirebase({ gameId: pin });
      if (firebaseGameState && firebaseGameState.status == 'Active') {
        setGameState({
          currentQuestionIndex: 0,
          gameId: pin,
          status: 'Active',
          pin,
          name: firebaseGameState.name,
          type: firebaseGameState.type,
          questions: firebaseGameState.questions,
          answers: firebaseGameState.answers,
          players: [{ name: playerName, id: Math.random().toString(36).substr(2, 9), score: 0, character }],
        });
        
        const currentPlayerId = Math.random().toString(36).substr(2, 9);

        navigation.navigate('LoadingMultiPlayer', {
          gameId: pin,
          gameName: firebaseGameState.name,
          pin: pin,
          playerName: playerName,
          isHost: false,
          character: character,
          currentPlayerId: currentPlayerId,
        });
      } else if (firebaseGameState && firebaseGameState.status == 'Started'){
        alert('Game already started!');
      }
      else {
        Alert.alert(
          'Game not found!', 
          'To join the game, one player must start the game room from the details.'
        );
      }
    } else {
      alert('Please enter a valid player name and PIN.');
    }
  }catch(error){
    console.log('Error in joinGame:', error);
  }
  };

  return (
    <View style={styles.container}>
  
      <View style={styles.inputContainer}>
        <TextInput
          style={{ ...styles.input, color: '#000' }}
          value={playerName}
          onChangeText={(text) => setPlayerName(text)}
          placeholder="Enter your name"
          placeholderTextColor="#000"
        />
      </View>
  
      <View style={styles.inputContainer}>
        <TextInput
          style={{ ...styles.input, color: '#000' }}
          value={pin}
          onChangeText={(text) => setPin(text)}
          placeholder="Enter game PIN"          
          placeholderTextColor="#000"
        />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Choose Character</Text>
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
  
      <TouchableOpacity style={styles.joinButton} onPress={joinGame}>
        <Text style={styles.joinButtonText}>Join Game</Text>
      </TouchableOpacity>
    </View>
  );
  


};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Align items to the top
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
    paddingTop: 20, // Adjust padding top
  },
  panel: {
    marginBottom: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    alignSelf: 'stretch',
  },
  panelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  characterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
  },
  characterButton: {
    padding: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#e9ecef',
  },
  selectedCharacterButton: {
    backgroundColor: '#007bff',
  },
  character: {
    fontSize: 40,
  },
  selectedCharacter: {
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 18,
    color: '#000', // Make input text color black
  },
  joinButton: {
    backgroundColor: '#3AA6B9',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default JoinGameScreen;
