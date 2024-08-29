import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useGameDB } from '../utils/GameDBContext';

const LibraryScreen = ({ navigation }) => {
  const { loadGamesByCategory } = useGameDB();
  const [games, setGames] = useState({
    popular: [],
    education: [],
    interview: [],
    geographic: [],
    history: [],
    riddle: [],
    custom: [],
  });

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const popularGames = await loadGamesByCategory('popular');
        const educationGames = await loadGamesByCategory('education');
        const interviewGames = await loadGamesByCategory('interview');
        const geographicGames = await loadGamesByCategory('geographic');
        const historyGames = await loadGamesByCategory('history');
        const riddleGames = await loadGamesByCategory('riddle');
        const customGames = await loadGamesByCategory('custom');

        setGames({
          popular: popularGames,
          education: educationGames,
          interview: interviewGames,
          geographic: geographicGames,
          history: historyGames,
          riddle: riddleGames,
          custom: customGames,
        });
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, [loadGamesByCategory]);

  const renderGames = (games) => {
    return games.map((game) => (
      <View key={game.gameId} style={styles.gameCard}>
        <Text style={styles.gameTitle}>{game.name}</Text>
        <Text style={styles.gameInfo}>Questions: {game.questions.length}</Text>
        <Text style={styles.gameInfo}>Created Date: {game.createdDate}</Text>
        <Text style={styles.gameInfo}>Created By: {game.createdBy}</Text>
        <Text style={styles.gameInfo}>
          Rating: {'★'.repeat(game.rating)}{'☆'.repeat(5 - game.rating)}
        </Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <ScrollView>
        <View style={[styles.panel, styles.popularPanel]}>
          <Text style={styles.panelTitle}>Popular Games</Text>
          <ScrollView horizontal>{renderGames(games.popular)}</ScrollView>
        </View>

        <View style={[styles.panel, styles.educationPanel]}>
          <Text style={styles.panelTitle}>Education Games</Text>
          <ScrollView horizontal>{renderGames(games.education)}</ScrollView>
        </View>

        <View style={[styles.panel, styles.interviewPanel]}>
          <Text style={styles.panelTitle}>Interview Games</Text>
          <ScrollView horizontal>{renderGames(games.interview)}</ScrollView>
        </View>

        <View style={[styles.panel, styles.geographicPanel]}>
          <Text style={styles.panelTitle}>Geographic Games</Text>
          <ScrollView horizontal>{renderGames(games.geographic)}</ScrollView>
        </View>

        <View style={[styles.panel, styles.historyPanel]}>
          <Text style={styles.panelTitle}>History Games</Text>
          <ScrollView horizontal>{renderGames(games.history)}</ScrollView>
        </View>

        <View style={[styles.panel, styles.riddlePanel]}>
          <Text style={styles.panelTitle}>Riddle Games</Text>
          <ScrollView horizontal>{renderGames(games.riddle)}</ScrollView>
        </View>

        <View style={[styles.panel, styles.customPanel]}>
          <Text style={styles.panelTitle}>Custom Games</Text>
          <ScrollView horizontal>{renderGames(games.custom)}</ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 16,
  },
  backButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  panel: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 10,
  },
  popularPanel: {
    backgroundColor: '#FFD700',
  },
  educationPanel: {
    backgroundColor: '#FF7F50',
  },
  interviewPanel: {
    backgroundColor: '#FF69B4',
  },
  geographicPanel: {
    backgroundColor: '#87CEEB',
  },
  historyPanel: {
    backgroundColor: '#32CD32',
  },
  riddlePanel: {
    backgroundColor: '#BA55D3',
  },
  customPanel: {
    backgroundColor: '#FFA07A',
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  gameCard: {
    backgroundColor: '#fff',
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    elevation: 2,
    width: 200,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  gameInfo: {
    fontSize: 14,
    marginBottom: 2,
  },
});

export default LibraryScreen;
