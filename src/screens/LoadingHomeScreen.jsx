import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { useGameDB } from '../utils/GameDBContext';

import { getDownloadURL, listAll, ref, getMetadata } from 'firebase/storage';
import { storage } from '../config/firebaseConfig'; 

import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Asset } from 'expo-asset';

const LoadingHomeScreen = ({ navigation }) => {
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const hasNavigatedRef = useRef(false);
  const { downloadGameFromFirebase } = useGameDB();

  // useEffect(() => {

  //   async function fetchData() {
  //     await downloadGameFromFirebase();
  //   }
  //   fetchData();
    
  // }, []);

  useEffect(() => {
    async function initialize() {
      copyImagesToLocal();
    //await downloadImagesToLocal();
    }
    initialize();
  }
)

  useEffect(() => {
    // Timer to update progress
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          clearInterval(timerRef.current);
          return prev;
        }
        return prev + 0.1;
      });
    }, 350);

    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    // Navigate to Home when progress is complete
    if (progress >= 1 && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      navigation.navigate('Home');
    }
  }, [progress, navigation]);

  // const downloadImagesToLocal = async () => {
  //   try {
  //     // Reference to the images directory in Firebase Storage
  //     const imagesRef = ref(storage, 'images/');
      
  //     // List all images in the directory
  //     const result = await listAll(imagesRef);
      
  //     // Loop through each image item
  //     for (const itemRef of result.items) {
  //       const imageName = itemRef.name;
  //       const localPath = `${FileSystem.documentDirectory}${imageName}`;
  
  //       //console.log(`Attempting to download image ${imageName} to ${localPath}`);
  
  //       // Ensure the directory exists
  //       const directory = localPath.substring(0, localPath.lastIndexOf('/'));
  //       const dirInfo = await FileSystem.getInfoAsync(directory);
  //       if (!dirInfo.exists) {
  //         await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
  //         console.log(`Directory created: ${directory}`);
  //       }
  
  //       // Check if the image already exists locally
  //       const fileInfo = await FileSystem.getInfoAsync(localPath);
  //       if (!fileInfo.exists) {
  //         try {
  //           // Get the image URL from Firebase Storage
  //           const downloadUrl = await getDownloadURL(itemRef);
  
  //           // Download the image to the local filesystem
  //           const downloadResumable = FileSystem.createDownloadResumable(
  //             downloadUrl,
  //             localPath
  //           );
  
  //           await downloadResumable.downloadAsync();
  //           //console.log(`Image ${imageName} downloaded to ${localPath}`);
  //         } catch (innerError) {
  //           console.error(`Error downloading image ${imageName}:`, innerError.message);
  //         }
  //       } else {
  //         //console.log(`Image ${imageName} already exists locally`);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error processing images from Firebase:', error.message);
  //   }
  // };  
 
  const images = {
    'celebrity_1_1.jpg': require('../resource/image/celebrity_1_1.jpg'),
    'celebrity_1_2.jpg': require('../resource/image/celebrity_1_2.jpg'),

    'celebrity_2_2.jpg': require('../resource/image/celebrity_2_2.jpg'),
    'celebrity_2_3.jpg': require('../resource/image/celebrity_2_3.jpg'),
    'celebrity_2_4.jpg': require('../resource/image/celebrity_2_4.jpg'),
    'celebrity_2_5.jpg': require('../resource/image/celebrity_2_5.jpg'),
    'celebrity_2_6.jpg': require('../resource/image/celebrity_2_6.jpg'),
    'education_1_1.jpg': require('../resource/image/education_1_1.jpg'),
    'education_1_2.jpg': require('../resource/image/education_1_2.jpg'),
    'education_1_3.jpg': require('../resource/image/education_1_3.jpg'),
    'education_1_4.jpg': require('../resource/image/education_1_4.jpg'),
    'education_1_5.jpg': require('../resource/image/education_1_5.jpg'),
    'general_2_1.jpg': require('../resource/image/general_2_1.jpg'),
    'general_2_2.jpg': require('../resource/image/general_2_2.jpg'),
    'general_2_3.jpg': require('../resource/image/general_2_3.jpg'),
    'general_2_4.jpg': require('../resource/image/general_2_4.jpg'),
    'general_2_5.jpg': require('../resource/image/general_2_5.jpg'),
    'general_2_6.jpg': require('../resource/image/general_2_6.jpg'),
    'geographic_2_1.jpg': require('../resource/image/geographic_2_1.jpg'),
    'geographic_2_2.jpg': require('../resource/image/geographic_2_2.jpg'),
    'geographic_2_3.jpg': require('../resource/image/geographic_2_3.jpg'),
    'geographic_2_4.jpg': require('../resource/image/geographic_2_4.jpg'),
    'geographic_2_5.jpg': require('../resource/image/geographic_2_5.jpg'),
    'history_2_1.jpg': require('../resource/image/history_2_1.jpg'),
    'history_2_2.jpg': require('../resource/image/history_2_2.jpg'),
    'history_2_3.jpg': require('../resource/image/history_2_3.jpg'),
    'history_2_4.jpg': require('../resource/image/history_2_4.jpg'),
    'history_2_5.jpg': require('../resource/image/history_2_5.jpg'),
    'interview_1_1.jpg': require('../resource/image/interview_1_1.jpg'),
    'interview_1_2.jpg': require('../resource/image/interview_1_2.jpg'),
    'interview_1_3.jpg': require('../resource/image/interview_1_3.jpg'),
    'interview_1_4.jpg': require('../resource/image/interview_1_4.jpg'),
    'interview_1_5.jpg': require('../resource/image/interview_1_5.jpg'),
    'interview_1_6.jpg': require('../resource/image/interview_1_6.jpg'),
    'interview_1_7.jpg': require('../resource/image/interview_1_7.jpg'),
    'interview_1_8.jpg': require('../resource/image/interview_1_8.jpg'),
    'interview_1_9.jpg': require('../resource/image/interview_1_9.jpg'),
    'interview_1_10.jpg': require('../resource/image/interview_1_10.jpg'),
    'interview_1_11.jpg': require('../resource/image/interview_1_11.jpg'),
    'riddle_1_1.jpg': require('../resource/image/riddle_1_1.jpg'),
    'riddle_1_2.jpg': require('../resource/image/riddle_1_2.jpg'),
    'riddle_1_3.jpg': require('../resource/image/riddle_1_3.jpg'),
    'riddle_1_4.jpg': require('../resource/image/riddle_1_4.jpg'),
    'riddle_1_5.jpg': require('../resource/image/riddle_1_5.jpg'),
    'riddle_1_6.jpg': require('../resource/image/riddle_1_6.jpg'),
    'riddle_1_7.jpg': require('../resource/image/riddle_1_7.jpg'),
    'riddle_1_8.jpg': require('../resource/image/riddle_1_8.jpg'),
    'riddle_1_9.jpg': require('../resource/image/riddle_1_9.jpg'),
    'riddle_1_10.jpg': require('../resource/image/riddle_1_10.jpg'),
    'riddle_2_1.jpg': require('../resource/image/riddle_2_1.jpg'),
    'riddle_2_2.jpg': require('../resource/image/riddle_2_2.jpg'),
    'riddle_2_3.jpg': require('../resource/image/riddle_2_3.jpg'),
    'riddle_2_4.jpg': require('../resource/image/riddle_2_4.jpg'),
    'riddle_2_5.jpg': require('../resource/image/riddle_2_5.jpg'),
    'riddle_2_6.jpg': require('../resource/image/riddle_2_6.jpg'),
    'game_logo.jpg': require('../resource/image/game_logo.jpg'),
    'logo_default_1.jpg': require('../resource/image/logo_default_1.jpg'),
    'game_default.jpg': require('../resource/image/game_default.jpg'),
  };
  
  const copyImagesToLocal = async () => {
    try {
      for (const [imageName, localImagePath] of Object.entries(images)) {
        const asset = Asset.fromModule(localImagePath);
        await asset.downloadAsync();
  
        // Destination path in the app's filesystem
        const destinationPath = `${FileSystem.documentDirectory}${imageName}`;
  
        // Check if the image already exists locally
        const fileInfo = await FileSystem.getInfoAsync(destinationPath);
        if (!fileInfo.exists) {
          // Copy the image to the local filesystem
          await FileSystem.copyAsync({
            from: asset.localUri,
            to: destinationPath,
          });
          //console.log(`Image ${imageName} copied to ${destinationPath}`);
        } else {
          //console.log(`Image ${imageName} already exists locally`);
        }
      }
    } catch (error) {
      console.error('Error processing images from local directory:', error.message);
    }
  };

  
  return (
    <View style={styles.container}>
      <Image source={require('../resource/image/game_default.jpg')} style={styles.logo} />
      <Progress.Bar
        progress={progress}
        width={200}
        height={20}
        color="#ff6f61"
        borderRadius={10}
        unfilledColor="#fff"
        borderColor="#fff"
        style={styles.progressBar}
      />
      <Text style={styles.footerText}>
        Welcome To{' '}
        <Text>
          <Text style={styles.qText}>Q</Text>
          <Text style={styles.uestionText}>uestion</Text>
          <Text style={styles.gText}>G</Text>
          <Text style={styles.ameText}>amez</Text>
        </Text>
      </Text>
      <Text style={styles.poweredByText}>Powered by Digital Dream Pte. Ltd.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  progressBar: {
    marginTop: 20,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderColor: '#000',
    borderWidth: 2,
  },
  footerText: {
    fontSize: 20,
    color: '#000',
    marginTop: 20,
  },
  qText: {
    fontSize: 30, // Larger font size for "Q"
    color: '#3498db', // Different color for "Q"
    fontWeight: 'bold', // Bold text for "Q"
  },
  uestionText: {
    fontSize: 20, // Regular font size for "uestion"
    color: '#e74c3c', // Different color for "uestion"
  },
  gText: {
    fontSize: 30, // Larger font size for "G"
    color: '#2ecc71', // Different color for "G"
    fontWeight: 'bold', // Bold text for "G"
  },
  ameText: {
    fontSize: 20, // Regular font size for "ame"
    color: '#9b59b6', // Different color for "ame"
  },
  poweredByText: {
    fontSize: 14,
    color: '#7f8c8d',
    position: 'absolute',
    bottom: 30,
  },
});

export default LoadingHomeScreen;
