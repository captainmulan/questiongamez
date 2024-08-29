import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useGameDB } from '../utils/GameDBContext';
import GameCardContainer from '../components/GameCardContainer';

const SearchGameScreen = ({ navigation }) => {
  const { searchGame } = useGameDB();
  const [searchCriteria, setSearchCriteria] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [categories, setCategories] = useState([
    { label: 'Riddle', checked: false },
    { label: 'Celebrity', checked: false },
    { label: 'Interview', checked: false },
    { label: 'Geographic', checked: false },
    { label: 'History', checked: false },
    { label: 'Education', checked: false },
    { label: 'General', checked: false },
    { label: 'MyList', checked: false },
    { label: '', checked: false }, // Placeholder for empty space
  ]);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    const selectedCategories = categories.filter(cat => cat.checked).map(cat => cat.label);
    const results = await searchGame(searchCriteria, selectedCategories.length ? selectedCategories : [], null, createdBy);
    setSearchResults(results);
  };

  const toggleCategory = (index) => {
    const updatedCategories = [...categories];
    updatedCategories[index].checked = !updatedCategories[index].checked;
    setCategories(updatedCategories);
  };

  const handleGamePress = (gameId) => {
    navigation.navigate('GameDetail', { gameId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Search game"
          value={searchCriteria}
          onChangeText={setSearchCriteria}
        />
        {/* <TextInput
          style={styles.textInput}
          placeholder="Created By"
          value={createdBy}
          onChangeText={setCreatedBy}
        /> */}
        <Text style={styles.checkboxLabel}>Select Category:</Text>
        <View style={styles.checkboxGrid}>
          <View style={styles.checkboxRow}>
            {categories.slice(0, 3).map((cat, index) => (
              <TouchableOpacity
                key={index}
                style={styles.checkboxItem}
                onPress={() => toggleCategory(index)}
              >
                <View style={[styles.checkBox, { backgroundColor: cat.checked ? '#3AA6B9' : '#fff' }]}>
                  {cat.checked && <Text style={styles.checkBoxText}>✓</Text>}
                </View>
                <Text>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.checkboxRow}>
            {categories.slice(3, 6).map((cat, index) => (
              <TouchableOpacity
                key={index + 3}
                style={styles.checkboxItem}
                onPress={() => toggleCategory(index + 3)}
              >
                <View style={[styles.checkBox, { backgroundColor: cat.checked ? '#3AA6B9' : '#fff' }]}>
                  {cat.checked && <Text style={styles.checkBoxText}>✓</Text>}
                </View>
                <Text>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.checkboxRow}>
            {categories.slice(6, 9).map((cat, index) => (
              <TouchableOpacity
                key={index + 6}
                style={styles.checkboxItem}
                onPress={() => toggleCategory(index + 6)}
                disabled={cat.label === ''} // Disable the empty category item
              >
                <View style={[styles.checkBox, { backgroundColor: cat.checked ? '#3AA6B9' : '#fff' }]}>
                  {cat.checked && <Text style={styles.checkBoxText}>✓</Text>}
                </View>
                <Text>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.resultsContainer}>
        {searchResults.map((game) => (
          <TouchableOpacity
            key={game.gameId}
            style={styles.gameCard}
            onPress={() => handleGamePress(game.gameId)}
          >
            <Text style={styles.gameName}>{game.name}</Text>
            <Text style={styles.gameInfo}>Category: {game.category}</Text>
            <Text style={styles.gameInfo}>Subcategory: {game.subCategory}</Text>
            <Text style={styles.gameInfo}>Created By: {game.createdBy}</Text>
            <Text style={styles.gameInfo}>Date: {new Date(game.createdDate).toLocaleDateString()}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.recommendContainer}>
        <GameCardContainer category="Popular" subCategory="" navigation={navigation} title="Popular" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF8DC',
  },
  searchContainer: {
    marginBottom: 20,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  checkboxGrid: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  checkboxItem: {
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  checkBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkBoxText: {
    fontSize: 14,
    color: '#fff',
  },
  resultsContainer: {
    flex: 1,
  },
  gameCard: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  gameName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameInfo: {
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: '#3AA6B9',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  recommendContainer: {
    marginTop: 20,
  },
});

export default SearchGameScreen;
