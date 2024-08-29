import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useGameDB } from '../utils/GameDBContext';
import {} from '../components/AdMobComponent';

const CreateGameByBatchScreen = () => {

  const hardcodedXmlData = ``;

  const [gamesData, setGamesData] = useState(hardcodedXmlData);
  const { createGameByBatch } = useGameDB();

  const handleCreateGames = async () => {
    try {
      await createGameByBatch(gamesData);
      Alert.alert('Success', 'Games created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create games.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
      {/* <AdMobComponent /> */}


        <Text style={styles.label}>Enter Games Data:</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={10}
          value={gamesData}
          onChangeText={setGamesData}
        />
        <TouchableOpacity style={styles.button} onPress={handleCreateGames}>
          <Text style={styles.buttonText}>Create Games by Batch</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  textInput: {
    height: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateGameByBatchScreen;
