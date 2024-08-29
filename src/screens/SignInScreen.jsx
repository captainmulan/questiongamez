import React, { useEffect, useState } from 'react';
import { View, Button, TextInput, Text, StyleSheet, Alert } from 'react-native';
import { getAuth, GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../config/firebaseConfig'; // Adjust the path as needed
//import * as GoogleSignIn from 'expo-google-sign-in';

// Initialize Firebase
//initializeApp(firebaseConfig);

//const auth = getAuth();

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    //initGoogleSignIn();
  }, []);

  // const initGoogleSignIn = async () => {
  //   try {
  //     await GoogleSignIn.initAsync({
  //       clientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // Use your web client ID here
  //     });
  //   } catch ({ message }) {
  //     Alert.alert('GoogleSignIn.initAsync(): ', message);
  //   }
  // };

  // const signInWithGoogleAsync = async () => {
  //   try {
  //     await GoogleSignIn.askForPlayServicesAsync();
  //     const { type, user } = await GoogleSignIn.signInAsync();
  //     if (type === 'success') {
  //       const credential = GoogleAuthProvider.credential(user.auth.idToken);
  //       await signInWithCredential(auth, credential);
  //       console.log('User signed in:', user.uid);
  //       navigation.navigate('GameDetailScreen');
  //     }
  //   } catch ({ message }) {
  //     Alert.alert('login: Error:', message);
  //   }
  // };

  // const signIn = async () => {
  //   try {
  //     const userCredential = await signInWithEmailAndPassword(auth, email, password);
  //     const user = userCredential.user;
  //     console.log('User signed in:', user.uid);
  //     navigation.navigate('GameDetailScreen');
  //   } catch (error) {
  //     console.error('Error signing in:', error);
  //     setError('Error signing in: ' + error.message);
  //   }
  // };

  // return (
  //   <View style={styles.container}>
  //     <TextInput
  //       placeholder="Email"
  //       value={email}
  //       onChangeText={setEmail}
  //       style={styles.input}
  //     />
  //     <TextInput
  //       placeholder="Password"
  //       value={password}
  //       onChangeText={setPassword}
  //       secureTextEntry
  //       style={styles.input}
  //     />
  //     {error ? <Text style={styles.errorText}>{error}</Text> : null}
  //     <Button title="Sign In" onPress={signIn} />
  //     <Button title="Sign In with Google" onPress={signInWithGoogleAsync} />
  //   </View>
  // );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
});

export default SignInScreen;
