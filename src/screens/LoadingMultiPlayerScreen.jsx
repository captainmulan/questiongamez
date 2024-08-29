import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Clipboard } from 'react-native';
import { GameContext } from '../context/GameContext';
import { useGameDB } from '../utils/GameDBContext';

const LoadingMultiPlayerScreen = ({ route, navigation }) => {
  const { gameId, gameName, pin, playerName, isHost, character, remark, currentPlayerId } = route.params;
  const { gameState, setGameState, shuffleQuestions } = useContext(GameContext);
  const { initializeGameAsHost, updateGameStateInFirebase, fetchGameStateFromFirebase } = useGameDB();
  const [selectedCharacter, setSelectedCharacter] = useState(character);
  const [loadingPlay, setLoadingPlay] = useState(false);
  
  const nextLine = '\n';
  const breakLine = '-------------------------------------------------------------------------------------------------------------------------------------------------------------';

  useEffect(() => {
    initializeGame();
    const interval = setInterval(checkGameStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const initializeGame = async () => {
    try {
      if (isHost) {
        handle_InitializeGameAsHost();
      } else {
        handle_JoinGameAsPlayer();
      }
    } catch (error) {
      console.error('Error initializing game:', error);
    }
  };

  const handle_InitializeGameAsHost = async () => {
    try {      
      const currentPlayers = [{ name: playerName, playerId: currentPlayerId, character, score: 0, playerType: 'host' }];      
      const currentLocalGameState = { gameId: gameId, players: currentPlayers, currentQuestionIndex: 0, pin: pin};
      //console.log('currentLocalGameState', currentLocalGameState)

      setGameState(await initializeGameAsHost(currentLocalGameState));
    } catch (error) {
      console.error('Error initializing game as host:', error);
    }
  };

  const handle_JoinGameAsPlayer = async () => {
    try {
      const currentPlayers = [{ name: playerName, playerId: currentPlayerId, character, score: 0, playerType: 'player' }];      
      const currentLocalGameState = { gameId: gameId, players: currentPlayers, currentQuestionIndex: 0, pin };

      //console.log("currentLocalGameState", currentLocalGameState);

      await updateGameStateInFirebase(currentLocalGameState, false);
      
      const firebaseGameState = await fetchGameStateFromFirebase(currentLocalGameState);

      if (firebaseGameState && firebaseGameState.status === 'Active') {
        setGameState(firebaseGameState);
      }
      else{
        Alert.alert('There is no active game in server. Go to your Fav game and click host to start multiplayer game.');
        navigation.navigate('JoinGame');
      }

    } catch (error) {
      console.error('Error joining game as player:', error);
    }
  };

  const handlePlay = async () => {
    try {
      const currentLocalGameState = { ...gameState, status: 'Started' };      
      await updateGameStateInFirebase(currentLocalGameState, isHost);
      
      //navigation.navigate('MultiPlayGame', { gameId: pin, currentPlayerId: currentPlayerId, isHostPlayer: isHost });
      setLoadingPlay(true); // Set loading to true to show the modal

      setTimeout(() => {
        setLoadingPlay(false); // Set loading to false to hide the modal
        navigation.navigate('MultiPlayGame', { gameId: pin, currentPlayerId: currentPlayerId, isHostPlayer: isHost });
      }, 8000); // 3-second delay before navigating

    } catch (error) {
      console.error('Error in handlePlay:', error);
    }
  };

  const checkGameStatus = async () => {
    try {      

      //console.log("gameState.gameId", gameState.gameId);
      const firebaseGameState = await fetchGameStateFromFirebase({ gameId: pin });
      //console.log("firebaseGameState", firebaseGameState);
 
      if (firebaseGameState && firebaseGameState.status === 'Started') {
        navigation.navigate('MultiPlayGame', { gameId: pin, currentPlayerId: currentPlayerId, isHostPlayer: isHost });
      }
      
      if (firebaseGameState && firebaseGameState.status === 'Active'){
        setGameState(firebaseGameState);
      }

    } catch (error) {
      console.error('Error checking game status:', error);
    }
  };

  const copyPinToClipboard = () => {
    Clipboard.setString(pin);
    Alert.alert('PIN Copied', 'The PIN has been copied to your clipboard.');
  };

  if (!gameState) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loadingPlay ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <>
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Game Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Game Name:</Text>
              <Text style={styles.data}>{gameState.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>PIN:</Text>
              <TouchableOpacity onPress={copyPinToClipboard}>
                <Text style={styles.linkText}>{gameState.pin}</Text>
              </TouchableOpacity>
            </View>
            {/* <View style={styles.detailRow}>
              <Text style={styles.label}>Remark:</Text>
              <Text style={styles.data}>{remark}</Text>
            </View> */}
            <View style={styles.remarkContainer}>
                <Text style={styles.remarkValue}>{remark}</Text>
            </View>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Your Profile</Text>
            <View style={styles.profileRow}>
              <Text style={styles.characterLarge}>{selectedCharacter}</Text>
              <Text style={styles.panelText}>{playerName}</Text>
            </View>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Game Room</Text>
            <ScrollView horizontal>
              <View style={styles.lobbyContainer}>
                {gameState.players.map((player) => (
                  <View key={player.playerId} style={styles.lobbyPlayer}>
                    <Text style={styles.characterLarge}>{player.character}</Text>
                    <Text style={styles.lobbyText}>{player.name}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          {isHost && (
            <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
              <Text style={styles.playButtonText}>Play</Text>
            </TouchableOpacity>
          )}    
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#FFF8DC',
    padding: 15,
  },
  panel: {
    marginBottom: 15,
    padding: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 1,
    color: '#FFB3B0',
  },
  panelText: {
    fontSize: 16,
    marginBottom: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },    
  
  characterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  characterButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    marginHorizontal: 5,
  },
  selectedCharacterButton: {
    backgroundColor: '#007bff',
  },
  characterLarge: {
    fontSize: 60,
    marginRight: 10,
    fontWeight: 'bold',
    color: '#ff4500',
  },
  character: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
  },
  selectedCharacter: {
    color: '#fff',
  },
  playButton: {
    padding: 15,
    backgroundColor: '#3AA6B9',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 1,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  lobbyText: {
    fontSize: 15,
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
    alignItems: 'left',
    marginHorizontal: 5,
    marginBottom: 5,
  },
  

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 25.8,
    //flex: 1, // To make the label take up space equally with data
  },
  data: {
    fontSize: 14,
    textAlign: 'right',
    flex: 1, // To make the data take up space equally with label
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
  linkText: {
    color: '#007BFF',
    textDecorationLine: 'underline',
    fontSize: 18,
  },
  remarkContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 8,
    marginTop: 8,
  },
  remarkValue: {
    textAlign: 'left',
    flexWrap: 'wrap',
  },
  digitalClock: {
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'monospace', // or use a custom font if you have one
    color: '#ff0000', // Red color to mimic digital clocks
    letterSpacing: 2, // Add some spacing between the characters
  },
});

export default LoadingMultiPlayerScreen;
