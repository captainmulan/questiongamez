import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useGameDB } from '../utils/GameDBContext';
import { storage } from '../config/firebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';
import { GameContext } from '../context/GameContext';
import * as FileSystem from 'expo-file-system';

type GameCardContainerProps = {
  category: string;
  subCategory: string;
  navigation: any;
  title: string;
};

const GameCardContainer: React.FC<GameCardContainerProps> = ({ category, subCategory, navigation, title }) => {
  const { loadGamesByCategory, loadGamesByDynamicColumn } = useGameDB();
  const [games, setGames] = useState<any[]>([]);
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const { shuffleArray } = useContext(GameContext);

  useEffect(() => {
    fetchGames();
  }, [category, subCategory, loadGamesByCategory]);

  useEffect(() => {
    fetchImages();
  }, [games]);

  const fetchGames = async () => {
    try {
      let games = [];

      if (category === "PopularRandom") {
        const popularGames = shuffleArray(await loadGamesByDynamicColumn("isPopular", "=", "1"));
        games = popularGames.slice(0, 1); // Select one random popular game
      } else if (category === "Popular") {
        games = shuffleArray(await loadGamesByDynamicColumn("isPopular", "=", "1"));
      } else if (category === "RecentlyAdded") {
        const recentDays = getRecentDayRange();
        games = shuffleArray(await loadGamesByDynamicColumn("createdDate", ">", recentDays));
      } else {
        games = await loadGamesByCategory(category);
      }

      setGames(games);
    } catch (error) {
      console.log('Error loading games:', error);
    }
  };

  const fetchImages = async () => {
    const imageUrls: { [key: string]: string } = {};
    for (const game of games) {
      const localUri = await checkAndDownloadImage(game.image);
      imageUrls[game.gameId] = localUri;
    }
    setImageUrls(imageUrls);
  };

  const checkAndDownloadImage = async (imageName: string) => {
    const localUri = `${FileSystem.documentDirectory}${imageName}.jpg`;
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    if (fileInfo.exists) {
      return localUri;
    } else {
      const imageUrl = await getFirebaseImageUrl(imageName);
      await FileSystem.downloadAsync(imageUrl, localUri);
      return localUri;
    }
  };

  const getFirebaseImageUrl = async (imageName = '') => {
    let firebasePath = imageName ? `images/${imageName}.jpg` : `images/game_default.jpg`;
  
    try {
      const imageRef = ref(storage, firebasePath);
      return await getDownloadURL(imageRef);
    } catch (error) {
      if (error.code === 'storage/object-not-found') {
        // Use default image if the requested image does not exist
        const defaultImageRef = ref(storage, 'images/game_default.jpg');
        return await getDownloadURL(defaultImageRef);
      } else {
        console.log('Error fetching image URL', error);
        // throw error; // Re-throw the error if it's not related to object not found
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const getRecentDayRange = () => {
    const date = new Date();
    date.setDate(date.getDate() - 2);
    return date.toISOString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.panelTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {games.map((game, index) => (
          <TouchableOpacity
            key={game.gameId}
            style={index === 0 && category === "PopularRandom" ? styles.featuredGameCard : styles.gameCard}
            onPress={() => navigation.navigate('GameDetail', { gameId: game.gameId })}
          >
            {imageUrls[game.gameId] ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: imageUrls[game.gameId] }} style={index === 0 && category === "PopularRandom" ? styles.featuredLogo : styles.logo} />
                <View style={styles.overlay}>
                  <Text numberOfLines={2} style={styles.gameName}>{game.name}</Text>
                </View>
              </View>
            ) : (
              <Text>Loading...</Text> // Placeholder while the image is loading
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  panelTitle: {
    fontSize: 18.2,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
    paddingLeft: 10,
  },
  gameCard: {
    marginRight: 10,
  },
  featuredGameCard: {
    marginRight: 10,
    width: 300,
    height: 200,
  },
  imageContainer: {
    position: 'relative',
    width: 200,
    height: 150,
    backgroundColor: 'white', // Light blue background color
    overflow: 'hidden', // Ensure the image doesn't overflow the container
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 5,
  },
  gameName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Ensures the image fits without stretching
  },
  featuredLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Ensures the image fits without stretching
  },
});

export default GameCardContainer;
