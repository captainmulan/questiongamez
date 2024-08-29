import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Pressable, Alert } from 'react-native';
//import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useGameDB } from '../utils/GameDBContext';
import * as FileSystem from 'expo-file-system';


const SettingScreen = ({ navigation }) => {
  const { deleteAllGames, getGamesByXML, downloadGameFromFirebase } = useGameDB();
  const [xmlData, setXmlData] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleDeleteAllGames = async () => {
    try {
      await deleteAllGames();
      deleteAllImages();
      alert('All game data has been cleared.');
    } catch (error) {
      console.error('Error clearing game data:', error);
      alert('Failed to clear game data. Please try again.');
    }
  };

  const handleShowData = async () => {
    try {
      const data = await getGamesByXML();
      setXmlData(data);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching games data:', error);
      alert('Failed to fetch game data. Please try again.');
    }
  };

  const handleModifyImages = async () => {
    navigation.navigate('ModifyImage');
  };

  const handleDownloadGame = async () => {
    try {
      Alert.alert('Success', 'Games created successfully!');
      await downloadGameFromFirebase();
    } catch (error) {
      console.error('SettingScreen/handleDownloadGame/Error: ', error);
      Alert.alert('Error', 'Failed to create games.');
    }
  };

  const deleteAllImages = async () => {
    try {
      // Get the list of files in the document directory
      const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
      
      // Iterate over the files and delete each one
      for (const file of files) {
        await FileSystem.deleteAsync(`${FileSystem.documentDirectory}${file}`, { idempotent: true });
      }
      
      console.log('All images deleted successfully');
    } catch (error) {
      console.error('Error deleting images:', error);
    }
  };

  const copyPinToClipboard = () => {
    Clipboard.setString(xmlData);
    Alert.alert('Data Copied', 'The Data has been copied to your clipboard.');
  };

  //const adUnitId = __DEV__ ? TestIds.BANNER : 'your-real-ad-unit-id';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <TouchableOpacity style={styles.resetButton} onPress={handleDeleteAllGames}>
        <Text style={styles.resetButtonText}>Delete All Game (Reset)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.showDataButton} onPress={handleShowData}>
        <Text style={styles.showDataButtonText}>Show All Data from Game DB</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.createBatchButton} onPress={() => navigation.navigate('CreateGameByBatch')}>
        <Text style={styles.createBatchButtonText}>Create Game By Batch</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modifyImageButton} onPress={handleModifyImages}>
        <Text style={styles.syncImagesButtonText}>Modify Image</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.createBatchButton} onPress={() => navigation.navigate('CreateGameByExcel')}>
        <Text style={styles.createBatchButtonText}>Create Game By Excel</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.resetButton} onPress={() => navigation.navigate('MultiPlayer')}>
        <Text style={styles.resetButtonText}>Test Multi Player</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.showDataButton} onPress={handleDownloadGame}>
        <Text style={styles.showDataButtonText}>download game from Firebase</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.adButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.adButtonText}>Ad Testing</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.adButton} onPress={() => navigation.navigate('Alphabet')}>
        <Text style={styles.adButtonText}>Alphabet</Text>
      </TouchableOpacity>


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>

          {/* <BannerAd
              unitId={adUnitId}
              size={BannerAdSize.FULL_BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            /> */}
            
            <TouchableOpacity style={styles.closeAdButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeAdButtonText}>Close Ad</Text>
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
    backgroundColor: '#FFF9C4',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  resetButton: {
    width: '80%',
    height: 50,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  showDataButton: {
    width: '80%',
    height: 50,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  showDataButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  createBatchButton: {
    width: '80%',
    height: 50,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  createBatchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modifyImageButton: {
    width: '80%',
    height: 50,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  syncImagesButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  adButton: {
    width: '80%',
    height: 50,
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  adButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  closeAdButton: {
    marginTop: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
  },
  closeAdButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SettingScreen;