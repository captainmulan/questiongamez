import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Pressable, Clipboard } from 'react-native';
import { useGameDB } from '../utils/GameDBContext';
import GameCardContainer from '../components/GameCardContainer';

const nextLine = '\n';
const breakLine = '-------------------------------------------------------------------------------------------------------------------------------------------------------------';

const GameDetailScreen = ({ route, navigation }) => {
  const { gameId } = route.params;
  const { loadGameById, loadGamesByDynamicColumn, checkDailyLimit, incrementDailyPlayCount } = useGameDB();
  const [game, setGame] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [multiPlayerModalVisible, setMultiPlayerModalVisible] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [questionDetailModalVisible, setQuestionDetailModalVisible] = useState(false);
  const [showPurchaseAlert, setShowPurchaseAlert] = useState(false);

  const [selectedCharacter, setSelectedCharacter] = useState('🤴');
  const [character, setCharacter] = useState(selectedCharacter);
  const characters = ['🤴', '👸', '🦄', '🐒', '🐶', '🐯', '🦁', '🐰', '🐧', '🐱', '🐘', ];

  useEffect(() => {
    fetchGame();
  }, [gameId, loadGameById]);

  const fetchGame = async () => {
    try {
      //const gameData = await loadGamesByDynamicColumn("gameId", "=", gameId);
      const gameData = await loadGameById(gameId);
      setGame(gameData);
    } catch (error) {
      console.error('Error loading game:', error);
    }
  };

  const handleShowQuestions = () => {
    setQuestionDetailModalVisible(true);
  };

  const handleCloseQuestions = () => {
    setQuestionDetailModalVisible(false);
  };

  const handlePlaySolo = async () => {
    //const dailyLimit = await checkDailyLimit("Annonymous");
  
    if (1 == 1) {
      //await incrementDailyPlayCount("Annonymous");
      setModalVisible(true);
    } else {
      Alert.alert(
        'Free limitation exceeded for today',
        'Please purchase to continue playing.',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Purchase',
            onPress: () => navigation.navigate('Purchase'),
          },
        ],
        { cancelable: false }
      );
    }
  };
  

  const handlePlay = () => {
    if (playerName.trim() === '') {
      Alert.alert('Error', 'Player name cannot be empty.');
      return;
    }
    navigation.navigate('LoadingPlayer', { gameId, pin: game.pin, playerName });
    setModalVisible(false);
  };

  const handleCancel = () => setModalVisible(false);

  //const handlePlayMulti = () => setMultiPlayerModalVisible(true);
  const handlePlayMulti = () => {   

    setMultiPlayerModalVisible(true);
    // Alert.alert('Information!', 'Coming soon.');
    // return;   
  };

  const handleHost = () => {
    if (playerName.trim() === '') {
      Alert.alert('Error', 'Player name cannot be empty.');
      return;
    }

    //console.log('GameDetailScreen/handleHost/Log/gameName: ', game.name, nextLine, breakLine);

    const currentPlayerId = Math.random().toString(36).substr(2, 9);
    navigation.navigate('LoadingMultiPlayer', { 
      gameId: gameId, 
      gameName: game.name, 
      pin: currentPlayerId.substring(0,6), 
      playerName: playerName + ' (Host)', 
      isHost: true,
      character: character,
      remark: game.remark,
      currentPlayerId: currentPlayerId,
     });
    setMultiPlayerModalVisible(false);
  };

  const handlePlayWithFriend = () => {
    if (playerName.trim() === '') {
      Alert.alert('Error', 'Player name cannot be empty.');
      return;
    }

    //console.log('GameDetailScreen/handlePlayWithFriend/Log/gameName: ', game.name, nextLine, breakLine);
    navigation.navigate('LoadingMultiPlayer', { gameId: gameId, gameName: game.name, pin: game.pin, playerName: playerName, isHost: false, character: character, remark: game.remark });
    setMultiPlayerModalVisible(false);
  };

  const handleMultiPlayerCancel = () => setMultiPlayerModalVisible(false);

  const handleCharacterChange = (char) => {
    setCharacter(char);
  };

  const copyPinToClipboard = () => {
    Clipboard.setString(game.pin);
    Alert.alert('PIN Copied', 'The PIN has been copied to your clipboard.');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handlePurchaseAlert = () => {
    setShowPurchaseAlert(true);

    navigation.navigate('Purchase');
  };

  return (
    <View style={styles.container}>
      {game ? (
        <>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.gameInfoContainer}>
              {[
                { label: 'Game Name', value: game.name },                
                { label: 'Questions', value: game.questions.length, onPress: handleShowQuestions, style: styles.linkText },
                // { label: 'Category', value: formatDate(game.category) },
                // { label: 'Created Date', value: formatDate(game.createdDate) },
                // { label: 'Created By', value: game.createdBy },
                // { label: 'Rating', value: '★★★☆☆' },
              ].map((info, index) => (
                <View key={index} style={styles.infoRow}>
                  <Text style={styles.label}>{info.label}:</Text>
                  <TouchableOpacity onPress={info.onPress} style={styles.valueContainer}>
                    <Text style={[styles.value, info.style]}>{info.value}</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <View style={styles.remarkContainer}>
                <Text style={styles.remarkValue}>{game.remark}</Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.playSoloButton]} onPress={handlePlaySolo}>
                <Text style={styles.buttonText}>Play Solo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.playMultiButton]} onPress={handlePlayMulti}>
                <Text style={styles.buttonText}>Play with Friends</Text>
              </TouchableOpacity>
            </View>
  
            <Modal animationType="slide" transparent visible={multiPlayerModalVisible} onRequestClose={handleMultiPlayerCancel}>
              <View style={styles.modalBackground}>
                <View style={styles.panel}>
                 
                  <Pressable style={styles.closeButton} onPress={handleMultiPlayerCancel}>
                    <Text style={styles.questiondetail_closeButtonText}>X</Text>
                  </Pressable>
                  <TextInput
                    style={styles.input}
                    placeholder="Player Name"
                    value={playerName}
                    onChangeText={setPlayerName}
                    placeholderTextColor="#000"
                  />

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

                  <View style={styles.modalButtonContainer}>
                    <Pressable style={styles.startGameRoomButton} onPress={handleHost}>
                      <Text style={styles.modalButtonText}>Start Game Room</Text>
                    </Pressable>
                    {/* <Pressable style={styles.modalPlayerButton} onPress={handlePlayWithFriend}>
                      <Text style={styles.modalButtonText}>Player</Text>
                    </Pressable>                     */}
                  </View>
                </View>
              </View>
            </Modal>
          </ScrollView>
  
          <View style={styles.relatedGamesContainer}>
            <GameCardContainer category={game.category} subCategory="" navigation={navigation} title="Related Games" />
          </View>
        </>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
  
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={handleCancel}>
        <View style={styles.modalBackground}>
          
          <View style={styles.modalContainer}>
          <Pressable style={styles.closeButton} onPress={handleCancel}>
            <Text style={styles.questiondetail_closeButtonText}>X</Text>
          </Pressable>
            <TextInput
              style={styles.input}
              placeholder="Player Name"
              value={playerName}
              onChangeText={setPlayerName}
              placeholderTextColor="#000"            
            />
            <View style={styles.modalButtonContainer}>
              <Pressable style={styles.modalButton} onPress={handlePlay}>
                <Text style={styles.modalButtonText}>Play</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
  
      {game && (
        <Modal animationType="slide" transparent visible={questionDetailModalVisible} onRequestClose={handleCloseQuestions}>
          <View style={styles.questiondetail_modalBackground}>
            <View style={styles.questiondetail_modalContainer}>
              <View style={styles.questiondetail_modalHeader}>
                <Text style={styles.questiondetail_modalTitle}>Questions and Answers</Text>
                <Pressable style={styles.questiondetail_closeButton} onPress={handleCloseQuestions}>
                  <Text style={styles.questiondetail_closeButtonText}>X</Text>
                </Pressable>
              </View>
              <ScrollView contentContainerStyle={styles.questiondetail_scrollViewContent}>
                {game.questions.map((question, index) => (
                  <View key={index} style={styles.questiondetail_questionContainer}>
                    <Text style={styles.questiondetail_questionText}>{question.text}</Text>
                    {question.answers.map((answer, idx) => (
                      <Text key={idx} 
                      style={[
                        styles.questiondetail_answerText,
                        answer.correctAnswer && styles.questiondetail_correctAnswerText,
                      ]}
                      >{answer.text}</Text>
                    ))}
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC',
  },
  scrollContainer: {
    padding: 16,
    flex: 1,
  },
  gameInfoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    flex: 1,
    lineHeight: 25.8,
  },
  valueContainer: {
    flex: 2,
    alignItems: 'flex-end',
  },
  value: {
    textAlign: 'right',
    flexWrap: 'wrap',
    lineHeight: 25.8,
  },
  linkText: {
    color: '#007BFF',
    textDecorationLine: 'underline',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playSoloButton: {
    backgroundColor: '#FF2170',
    marginRight: 10,
    elevation: 3,
  },
  playMultiButton: {
    backgroundColor: '#FFB3B0',
    elevation: 3,
  },
  startGameRoomButton: {
    backgroundColor: '#3AA6B9',
    paddingVertical: 12, // Adjusted padding for smaller size
    paddingHorizontal: 20, // Adjusted padding for smaller size
    alignItems: 'center',
    justifyContent: 'center',
    height: 50, // Adjusted height for smaller size
    width: 200, // Adjusted width for smaller size
    borderRadius: 8,
    marginRight: 10, // Added space between buttons
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  relatedGamesContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF8DC',
    padding: 16,
    // borderTopWidth: 1,
    // borderTopColor: '#ccc',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    alignItems: 'left',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: 265,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 18,
  },
  modalButtonContainer: {
    flexDirection: 'row',    
    justifyContent: 'flex-start',//'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#3AA6B9',
    paddingVertical: 12, // Adjusted padding for smaller size
    paddingHorizontal: 20, // Adjusted padding for smaller size
    alignItems: 'center',
    justifyContent: 'center',
    height: 50, // Adjusted height for smaller size
    width: 120, // Adjusted width for smaller size
    borderRadius: 8,
    marginRight: 10, // Added space between buttons
  },
  modalPlayerButton: {
    // backgroundColor: 'green',
    // borderRadius: 10,
    // paddingVertical: 16,
    // paddingHorizontal: 24,
    // alignItems: 'center',
    // justifyContent: 'center',
    // flex: 1,
    // marginRight: 10,

    backgroundColor: 'green',
    paddingVertical: 12, // Adjusted padding for smaller size
    paddingHorizontal: 20, // Adjusted padding for smaller size
    alignItems: 'center',
    justifyContent: 'center',
    height: 50, // Adjusted height for smaller size
    width: 120, // Adjusted width for smaller size
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#FFB3B0',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  closeButton: {    
    // backgroundColor: '#FFD700',
    // borderRadius: 8,
    // padding: 5,
    position: 'absolute',
    top: 3, // Adjust this value to position the button at desired top position
    right: 3, // Adjust this value to position the button at desired right position
    backgroundColor: '#FFD700',
    borderRadius: 8,
    padding: 5,
    width: 30,
    height: 30.9,
  },

  // Question & Answers Modal Styles
  questiondetail_modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  questiondetail_modalContainer: {
    width: '90%',
    backgroundColor: 'lightyellow',
    borderRadius: 10,
    padding: 20,
    maxHeight: '97%',
    alignSelf: 'center',
  },
  questiondetail_modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questiondetail_modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#39AFEA',
  },
  questiondetail_closeButton: {    
    // backgroundColor: '#FFD700',
    // borderRadius: 8,
    // padding: 5,
    position: 'absolute',
    top: -5, // Adjust this value to position the button at desired top position
    right: -15, // Adjust this value to position the button at desired right position
    backgroundColor: '#FFD700',
    borderRadius: 8,
    padding: 5,
    width: 30,
    height: 30.9,
  },
  questiondetail_closeButtonText: {
    fontSize: 16,
    color: 'blue',
    textAlign: 'center',
  },
  questiondetail_scrollViewContent: {
    flexGrow: 1,
  },
  questiondetail_questionContainer: {
    marginBottom: 20,
  },
  questiondetail_questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  questiondetail_answerText: {
    fontSize: 16,
    color: '#666',
  },

  panel: {
    marginVertical: 5,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  characterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 1,
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
    fontSize: 80, // Increased size for better visibility
    marginRight: 10,
    fontWeight: 'bold',
    color: '#ff4500', // Bright orange color for vibrancy
  },
  character: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#000', // Black for better contrast
  },
  selectedCharacter: {
    color: '#fff',
    fontWeight: 'bold',
  },
  questiondetail_correctAnswerText: {
    color: 'green',
  },

});



export default GameDetailScreen;
