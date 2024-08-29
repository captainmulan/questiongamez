// import firebase from 'firebase/app';
// import 'firebase/database';
// import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import * as SQLite from 'expo-sqlite';
// import { parseString, Builder } from 'xml2js';
// import { v4 as uuidv4 } from 'uuid';
// import { initializeApp } from 'firebase/app';
// import { getDatabase, ref, onValue, set, get, update } from 'firebase/database';

// const initializeGameAsHost = async () => {
//   try {
//     const gameRef = firebase.database().ref('gameState').child(gameId);

//     const snapshot = await gameRef.once('value');
//     const gameExists = snapshot.exists();

//     if (!gameExists) {
//       const newGame = {
//         gameId: gameId,
//         name: gameName,
//         pin: pin,
//         type: 'multiplayer',
//         players: [], // Initialize players array
//         currentQuestionIndex: 0,
//         questions: [], // Add your sample questions here
//       };

//       await gameRef.set(newGame);
//     }

//     fetchGameFromFirebase();
//   } catch (error) {
//     console.error('Error initializing game as host:', error);
//   }
// };

// const fetchGameFromFirebase = async () => {
//   try {
//     const gameRef = firebase.database().ref('gameState').child(gameId);
//     gameRef.on('value', (snapshot) => {
//       const gameData = snapshot.val();
//       if (gameData) {
//         setGameState(gameData);
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching game data from Firebase:', error);
//   }
// };
