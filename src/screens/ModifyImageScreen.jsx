import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Image, TextInput, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../config/firebaseConfig';
import * as FileSystem from 'expo-file-system';
import { useGameDB } from '../utils/GameDBContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ModifyImageScreen = ({ navigation }) => {
  const defaultImage = '../resource/image/game_default.png';
  //const { updateImageByPin } = useGameDB();

  //const [pin, setPin] = useState('KGPh0001');
  const [gameImage, setGameImage] = useState(defaultImage);
  
  const [pickedImage, setPickedImage] = useState(null);
  const [firebaseImageUrl, setFirebaseImageUrl] = useState(null);

  useEffect(() => {}, []);  

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log("result: " , result); // Log the entire result object to inspect what's returned
  
      if (!result.cancelled) {
        const pickedImageUri = result.assets[0].uri; // Accessing the URI of the first asset (assuming single selection)
        console.log("Picked Image URI:", pickedImageUri);
        setPickedImage(pickedImageUri);
      }
       else {
        console.log('Image picking cancelled');
      }
    } catch (error) {
      console.error('Error picking image', error);
    }
  };
  

  const saveImageToFirebase = async () => {
    if (pickedImage !== null && pickedImage !== undefined) {
      const response = await fetch(pickedImage);
      const blob = await response.blob();
      const imageRef = ref(storage, `images/${new Date().toISOString()}`);
      
      uploadBytes(imageRef, blob).then((snapshot) => {
        console.log('Uploaded a blob or file!', snapshot);
        Alert.alert('Save Image', 'Image uploaded to Firebase successfully');
      }).catch((error) => {
        console.error('Upload failed', error);
        Alert.alert('Save Image Error', 'Failed to upload image to Firebase');
      });
    } else {
      Alert.alert('No Image', 'Please pick an image first.');
    }
  };
  

  const showFirebaseImage = async () => {
    const imageRef = ref(storage, `images/${new Date().toISOString()}`);
    try {
      const url = await getDownloadURL(imageRef);
      setFirebaseImageUrl(url);
      Alert.alert('Show Image', 'Image URL retrieved from Firebase successfully');
    } catch (error) {
      console.error('Error fetching image URL', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modify Image</Text>

      {/* Image Save to Firebase Container */}
      <View style={styles.panel}>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {pickedImage && <Image source={{ uri: pickedImage }} style={{ width: 200, height: 200 }} />}
        <Button title="Save Image" onPress={saveImageToFirebase} />
      </View>

      {/* Firebase Image Display */}
      <View style={styles.panel}>
        <Button title="Show Firebase Image" onPress={showFirebaseImage} />
        {firebaseImageUrl && <Image source={{ uri: firebaseImageUrl }} style={{ width: 200, height: 200 }} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  panel: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
  },  
});

export default ModifyImageScreen;
