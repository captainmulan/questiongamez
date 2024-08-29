import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing, Modal, TextInput, Pressable } from 'react-native';
import { useGameDB } from '../utils/GameDBContext';
import GameCardContainer from '../components/GameCardContainer';

import * as FileSystem from 'expo-file-system';
import { getDownloadURL, listAll, ref, getMetadata } from 'firebase/storage';
import { storage } from '../config/firebaseConfig'; 

const HomeScreen = ({ navigation }) => {
  const { downloadGameFromFirebase, initData_SQLite } = useGameDB();
  const [games, setGames] = useState({
    Riddle: [],  Celebrity: [], Interview: [],
    Geographic: [], History: [], Education: [], General: [], Popular: [], RecentlyAdded: [] , MyList: []
  });

  const [jumpAnimation] = useState(new Animated.Value(0));
  const [adminPwdModalVisible, setAdminPwdModalVisible] = useState(false);
  const [adminPwd, setAdminPwd] = useState('');

  useEffect(() => {
    downloadImagesToLocal();
    initData_SQLite(); 
    downloadGameFromFirebase();     
  }, []);

  useEffect(() => {    
    startJumping();
  }, [jumpAnimation]);  

  const startJumping = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(jumpAnimation, {
          toValue: -10,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(jumpAnimation, {
          toValue: 0,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const handleJoin = () => {
    navigation.navigate('JoinGame');
  }

  const handleInfo = () => {
    //setAdminPwdModalVisible(true);
    navigation.navigate('Info');
  }

  const verifyAdminPwd = () => {
    if (adminPwd === 'admin123') {
      setAdminPwdModalVisible(false);
      navigation.navigate('Setting');
    } else {
      alert('Incorrect Admin Password');
    }
  }

  const downloadImagesToLocal = async () => {
    try {
      // Reference to the images directory in Firebase Storage
      const imagesRef = ref(storage, 'images/');
      
      // List all images in the directory
      const result = await listAll(imagesRef);
      
      // Loop through each image item
      for (const itemRef of result.items) {
        const imageName = itemRef.name;
        const localPath = `${FileSystem.documentDirectory}${imageName}`;
  
        //console.log(`Attempting to download image ${imageName} to ${localPath}`);
  
        // Ensure the directory exists
        const directory = localPath.substring(0, localPath.lastIndexOf('/'));
        const dirInfo = await FileSystem.getInfoAsync(directory);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
          console.log(`Directory created: ${directory}`);
        }
  
        // Check if the image already exists locally
        const fileInfo = await FileSystem.getInfoAsync(localPath);
        if (!fileInfo.exists) {
          try {
            // Get the image URL from Firebase Storage
            const downloadUrl = await getDownloadURL(itemRef);
  
            // Download the image to the local filesystem
            const downloadResumable = FileSystem.createDownloadResumable(
              downloadUrl,
              localPath
            );
  
            await downloadResumable.downloadAsync();
            //console.log(`Image ${imageName} downloaded to ${localPath}`);
          } catch (innerError) {
            console.error(`Error downloading image ${imageName}:`, innerError.message);
          }
        } else {
          //console.log(`Image ${imageName} already exists locally`);
        }
      }
    } catch (error) {
      console.error('Error processing images from Firebase:', error.message);
    }
  };  

  return (
    <View style={styles.container}>
      <ScrollView style={styles.gamePanel}>
        {Object.keys(games).map((category) => (
          <View key={category} style={[styles.panel, styles[`${category}Panel`]]}>
            <GameCardContainer category={category} subCategory="" navigation={navigation} title={`${category.charAt(0).toUpperCase() + category.slice(1)}`} />
          </View>
        ))}
      </ScrollView>

      <View style={styles.navbar}>
        <TouchableOpacity style={[styles.navButton, styles.homeButton]} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navButtonText}>
            <Text style={styles.unicodeIcon}>🏠</Text>
            {'\n'}
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, styles.libraryButton]} onPress={() => navigation.navigate('SearchGame')}>
          <Text style={styles.navButtonText}>
            <Text style={styles.unicodeIcon}>🔍</Text>
            {'\n'}
            Search
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, styles.joinButton, { transform: [{ translateY: jumpAnimation }] }]}
          onPress={handleJoin}
        >
          <Text style={styles.navButtonText}>
            <Text style={styles.unicodeIcon}>🎮</Text>
            {'\n'}
            Join
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, styles.createButton]} onPress={() => navigation.navigate('Create')}>
          <Text style={styles.navButtonText}>
            <Text style={styles.unicodeIcon}>➕</Text>
            {'\n'}
            Create
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, styles.settingButton]} onPress={handleInfo}>
          <Text style={styles.navButtonText}>
            <Text style={styles.unicodeIcon}>📊</Text>
            {'\n'}
            Info
          </Text>
        </TouchableOpacity>
      </View>

      {/* Admin Password Modal */}
      <Modal animationType="slide" transparent visible={adminPwdModalVisible} onRequestClose={() => setAdminPwdModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter Admin Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Admin Password"
              secureTextEntry
              value={adminPwd}
              onChangeText={setAdminPwd}
            />
            <View style={styles.modalButtonContainer}>
              <Pressable style={styles.modalButton} onPress={verifyAdminPwd}>
                <Text style={styles.modalButtonText}>Submit</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={() => setAdminPwdModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC',//'#00BFFF'
  },
  gamePanel: {
    flex: 1,
  },
  panel: {
    // padding: 5,
    // marginBottom: -10,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FFFFFF',
  },
  gameCard: {
    backgroundColor: '#333333',
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    width: 200,
  },
  gameName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#FFFFFF',
  },
  gameInfo: {
    fontSize: 14,
    marginBottom: 2,
    color: '#DDDDDD',
  },
  hidden: {
    display: 'none',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    backgroundColor: '#808080',
    borderTopColor: '#DDDDDD',
    borderTopWidth: 1,
  },
  navButton: {
    alignItems: 'center',
    flex: 1,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  unicodeIcon: {
    fontSize: 24,
  },
  homeButton: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    paddingVertical: 10,
  },
  libraryButton: {
    backgroundColor: '#28A745',
    borderRadius: 10,
    paddingVertical: 10,
  },
  joinButton: {
    backgroundColor: '#DC3545',
    borderRadius: 10,
    paddingVertical: 10,
  },
  createButton: {
    backgroundColor: '#FFC107',
    borderRadius: 10,
    paddingVertical: 10,
  },
  settingButton: {
    backgroundColor: '#17A2B8',
    borderRadius: 10,
    paddingVertical: 10,
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
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: 300,
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
    justifyContent: 'flex-start',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#3AA6B9',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#FFB3B0',
    marginRight: 0,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
