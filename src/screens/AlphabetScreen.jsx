import React from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity, Dimensions } from 'react-native';

const HumanBodyScreen = () => {
  const { width, height } = Dimensions.get('window');

  const handlePartPress = (part) => {
    Alert.alert(`You clicked the ${part}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>Where is the stomach?</Text>
      <View style={styles.imageContainer}>
        <Image source={require('../resource/image/body_anatomy.jpg')} style={styles.bodyImage} />
        
        {/* Define clickable areas */}
        <TouchableOpacity
          style={[styles.area, { top: 30, left: 70, width: 60, height: 50 }]}
          onPress={() => handlePartPress('head')}
        />
        <TouchableOpacity
          style={[styles.area, { top: 80, left: 90, width: 20, height: 10 }]}
          onPress={() => handlePartPress('eye')}
        />
        <TouchableOpacity
          style={[styles.area, { top: 80, left: 115, width: 20, height: 10 }]}
          onPress={() => handlePartPress('eye')}
        />
        <TouchableOpacity
          style={[styles.area, { top: 105, left: 95, width: 10, height: 10 }]}
          onPress={() => handlePartPress('nose')}
        />
        <TouchableOpacity
          style={[styles.area, { top: 120, left: 90, width: 20, height: 10 }]}
          onPress={() => handlePartPress('mouth')}
        />
        <TouchableOpacity
          style={[styles.area, { top: 55, left: 60, width: 30, height: 30 }]}
          onPress={() => handlePartPress('ear')}
        />
        <TouchableOpacity
          style={[styles.area, { top: 55, left: 140, width: 30, height: 30 }]}
          onPress={() => handlePartPress('ear')}
        />
        <TouchableOpacity
          style={[styles.area, { top: 80, left: 75, width: 50, height: 80 }]}
          onPress={() => handlePartPress('body')}
        />
        <TouchableOpacity
          style={[styles.area, { top: 140, left: 75, width: 50, height: 20 }]}
          onPress={() => handlePartPress('stomach')}
        />
        <TouchableOpacity
          style={[styles.area, { top: 100, left: 90, width: 20, height: 20 }]}
          onPress={() => handlePartPress('heart')}
        />
        <TouchableOpacity
          style={[styles.area, { top: 120, left: 85, width: 20, height: 20 }]}
          onPress={() => handlePartPress('kidney')}
        />
        <TouchableOpacity
          style={[styles.area, { top: 80, left: 40, width: 20, height: 60 }]}
          onPress={() => handlePartPress('left arm')}
        />
        <TouchableOpacity
          style={[styles.area, { top: 80, left: 140, width: 20, height: 60 }]}
          onPress={() => handlePartPress('right arm')}
        />
        <TouchableOpacity
          style={[styles.area, { top: 140, left: 30, width: 20, height: 15 }]}
          onPress={() => handlePartPress('left hand')}
        />
        <TouchableOpacity
          style={[styles.area, { top: 140, left: 150, width: 20, height: 15 }]}
          onPress={() => handlePartPress('right hand')}
        />
        <TouchableOpacity
          style={[styles.area, { top: 200, left: 85, width: 20, height: 20 }]}
          onPress={() => handlePartPress('left knee')}
        />
        <TouchableOpacity
          style={[styles.area, { top: 200, left: 115, width: 20, height: 20 }]}
          onPress={() => handlePartPress('right knee')}
        />
        <TouchableOpacity
          style={[styles.area, { top: 160, left: 75, width: 20, height: 80 }]}
          onPress={() => handlePartPress('left leg')}
        />
        <TouchableOpacity
          style={[styles.area, { top: 160, left: 125, width: 20, height: 80 }]}
          onPress={() => handlePartPress('right leg')}
        />
        <TouchableOpacity
          style={[styles.area, { top: 240, left: 70, width: 25, height: 20 }]}
          onPress={() => handlePartPress('left foot')}
        />
        <TouchableOpacity
          style={[styles.area, { top: 240, left: 125, width: 25, height: 20 }]}
          onPress={() => handlePartPress('right foot')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  bodyImage: {
    width: 300,
    height: 600,
  },
  area: {
    position: 'absolute',
    backgroundColor: 'transparent',
  },
});

export default HumanBodyScreen;
