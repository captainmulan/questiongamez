import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity } from 'react-native';
import 'react-native-get-random-values';

import { GameProvider, GameContext } from './src/context/GameContext';
import { GameDBProvider } from './src/utils/GameDBContext';
import JoinGameScreen from './src/screens/JoinGameScreen';
import PlayGameScreen from './src/screens/PlayGameScreen';
import FinalResultScreen from './src/screens/FinalResultScreen';
import HomeScreen from './src/screens/HomeScreen';
import CreateGameScreen from './src/screens/CreateGameScreen';
import SettingScreen from './src/screens/SettingScreen';
import LoadingHomeScreen from './src/screens/LoadingHomeScreen';
import LoadingPlayerScreen from './src/screens/LoadingPlayerScreen';
import CreateGameByBatchScreen from './src/screens/CreateGameByBatchScreen';
import GameDetailScreen from './src/screens/GameDetailScreen';
import ModifyImageScreen from './src/screens/ModifyImageScreen';
import SearchGameScreen from './src/screens/SearchGameScreen';
import CreateGameByExcelScreen from './src/screens/CreateGameByExcelScreen';
import LoadingMultiPlayerScreen from './src/screens/LoadingMultiPlayerScreen';
import MultiPlayGameScreen from './src/screens/MultiPlayGameScreen';
import SignInScreen from './src/screens/SignInScreen';
import PurchaseScreen from './src/screens/PurchaseScreen';
import InfoScreen from './src/screens/InfoScreen';
import AlphabetScreen from './src/screens/AlphabetScreen';
// import * as Sentry from '@sentry/react-native';

// Sentry.init({
//   dsn: 'https://e866107fc6b5d4be28cc16d6e5ef22da@o4507656396537856.ingest.us.sentry.io/4507656407547904', // Replace with your Sentry DSN
//   enableInExpoDevelopment: true, // Optional: Enable Sentry in Expo development mode
//   debug: true, // Optional: Output debugging information to the console
// });


const Stack = createStackNavigator();

const App = () => {


//   useEffect(() => {
//     // Testing Sentry setup
//     Sentry.captureMessage('Test message');
//     Sentry.captureException(new Error('Test exception'));
//   }, []);

  const HeaderLeft = ({ navigation }) => {
    const { setGameState } = useContext(GameContext);
    
    const handleHomePress = () => {
      setGameState({
        currentQuestionIndex: 0,
        questions: [],
        players: [],
        pin: '',
        title: '',
        gameType: '',
      });
      navigation.navigate('Home');
    };

    return (
      <TouchableOpacity style={{ marginLeft: 15 }} onPress={handleHomePress}>
        <Text style={{ fontSize: 24 }}>🏠</Text>
      </TouchableOpacity>
    );
  };

  const HeaderTitle = ({ route }) => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: 40 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>{route?.name}</Text>
    </View>
  );

  const HeaderRight = () => (
    <View style={{ flexDirection: 'row', marginRight: 7 }}>
      <TouchableOpacity style={{ paddingHorizontal: 10 }}>
        <Text style={{ fontSize: 20 }}>🌐</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ paddingHorizontal: 10 }}>
        <Text style={{ fontSize: 20 }}>👤</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <NavigationContainer>
      <GameDBProvider>
        <GameProvider>
          <Stack.Navigator initialRouteName="LoadingHome">
            <Stack.Screen 
              name="LoadingHome" 
              component={LoadingHomeScreen} 
              options={{ headerShown: false }} // Hide the header
            />
            <Stack.Screen 
              name="LoadingPlayer" 
              component={LoadingPlayerScreen} 
              options={({ navigation, route }) => ({ 
                title: 'Loading Players',
                headerLeft: () => <HeaderLeft navigation={navigation} />,
                headerTitle: () => <HeaderTitle route={route} />,
                headerRight: () => <HeaderRight />,
                headerTitleAlign: 'center',
              })} 
            />
            
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={({ navigation, route }) => ({ 
                title: 'Home',
                headerLeft: () => <HeaderLeft navigation={navigation} />,
                headerTitle: () => <HeaderTitle route={route} />,
                headerRight: () => <HeaderRight />,
                headerTitleAlign: 'center',
              })} 
            />

            <Stack.Screen 
              name="Create" 
              component={CreateGameScreen}
              options={({ navigation, route }) => ({
                title: 'Create',
                headerLeft: () => <HeaderLeft navigation={navigation} />,
                headerTitle: () => <HeaderTitle route={route} />,
                headerRight: () => <HeaderRight />,
                headerTitleAlign: 'center',
              })}
            />
            <Stack.Screen 
              name="JoinGame" 
              component={JoinGameScreen}
              options={({ navigation, route }) => ({
                title: 'JoinGame',
                headerLeft: () => <HeaderLeft navigation={navigation} />,
                headerTitle: () => <HeaderTitle route={route} />,
                headerRight: () => <HeaderRight />,
                headerTitleAlign: 'center',
              })}
            />
            <Stack.Screen 
              name="PlayGame" 
              component={PlayGameScreen}
              options={({ navigation, route }) => ({
                title: 'PlayGame',
                headerLeft: () => <HeaderLeft navigation={navigation} />,
                headerTitle: () => <HeaderTitle route={route} />,
                headerRight: () => <HeaderRight />,
                headerTitleAlign: 'center',
              })}
            />
            <Stack.Screen 
              name="SearchGame" 
              component={SearchGameScreen}
              options={({ navigation, route }) => ({
                title: 'SearchGame',
                headerLeft: () => <HeaderLeft navigation={navigation} />,
                headerTitle: () => <HeaderTitle route={route} />,
                headerRight: () => <HeaderRight />,
                headerTitleAlign: 'center',
              })}
            />
            <Stack.Screen 
              name="Setting" 
              component={SettingScreen}
              options={({ navigation, route }) => ({
                title: 'Setting',
                headerLeft: () => <HeaderLeft navigation={navigation} />,
                headerTitle: () => <HeaderTitle route={route} />,
                headerRight: () => <HeaderRight />,
                headerTitleAlign: 'center',
              })}
            />            
            <Stack.Screen 
              name="FinalResult" 
              component={FinalResultScreen}
              options={({ navigation, route }) => ({
                title: 'FinalResult',
                headerLeft: () => <HeaderLeft navigation={navigation} />,
                headerTitle: () => <HeaderTitle route={route} />,
                headerRight: () => <HeaderRight />,
                headerTitleAlign: 'center',
              })}
            />
            <Stack.Screen 
              name="CreateGameByBatch" 
              component={CreateGameByBatchScreen}
              options={({ navigation, route }) => ({
                title: 'Create Game By Batch',
                headerLeft: () => <HeaderLeft navigation={navigation} />,
                headerTitle: () => <HeaderTitle route={route} />,
                headerRight: () => <HeaderRight />,
                headerTitleAlign: 'center',
              })}
            />
            <Stack.Screen 
              name="GameDetail" 
              component={GameDetailScreen} 
              options={({ navigation, route }) => ({ 
                title: 'Game Details',
                headerLeft: () => <HeaderLeft navigation={navigation} />,
                headerTitle: () => <HeaderTitle route={route} />,
                headerRight: () => <HeaderRight />,
                headerTitleAlign: 'center',
              })} 
            />
            <Stack.Screen 
              name="ModifyImage" 
              component={ModifyImageScreen} 
              options={({ navigation, route }) => ({ 
                title: 'Modify Image',
                headerLeft: () => <HeaderLeft navigation={navigation} />,
                headerTitle: () => <HeaderTitle route={route} />,
                headerRight: () => <HeaderRight />,
                headerTitleAlign: 'center',
              })} 
            />
            <Stack.Screen 
              name="CreateGameByExcel" 
              component={CreateGameByExcelScreen} 
              options={({ navigation, route }) => ({ 
                title: 'Create GameBy Excel',
                headerLeft: () => <HeaderLeft navigation={navigation} />,
                headerTitle: () => <HeaderTitle route={route} />,
                headerRight: () => <HeaderRight />,
                headerTitleAlign: 'center',
              })} 
            />           
            
            <Stack.Screen 
              name="LoadingMultiPlayer" 
              component={LoadingMultiPlayerScreen} 
              options={({ navigation, route }) => ({ 
                title: 'Loading Players',
                headerLeft: () => <HeaderLeft navigation={navigation} />,
                headerTitle: () => <HeaderTitle route={route} />,
                headerRight: () => <HeaderRight />,
                headerTitleAlign: 'center',
              })} 
            />
            <Stack.Screen 
              name="MultiPlayGame" 
              component={MultiPlayGameScreen} 
              options={({ navigation, route }) => ({ 
                title: 'Play with Friends',
                headerLeft: () => <HeaderLeft navigation={navigation} />,
                headerTitle: () => <HeaderTitle route={route} />,
                headerRight: () => <HeaderRight />,
                headerTitleAlign: 'center',
              })} 
            />
            <Stack.Screen 
              name="SignIn" 
              component={SignInScreen} 
              options={({ navigation, route }) => ({ 
                title: 'Sign In',
                headerLeft: () => <HeaderLeft navigation={navigation} />,
                headerTitle: () => <HeaderTitle route={route} />,
                headerRight: () => <HeaderRight />,
                headerTitleAlign: 'center',
              })} 
            />
            <Stack.Screen 
              name="Purchase" 
              component={PurchaseScreen} 
              options={({ navigation, route }) => ({ 
                title: 'Purchase',
                headerLeft: () => <HeaderLeft navigation={navigation} />,
                headerTitle: () => <HeaderTitle route={route} />,
                headerRight: () => <HeaderRight />,
                headerTitleAlign: 'center',
              })} 
            />
             <Stack.Screen 
              name="Info" 
              component={InfoScreen} 
              options={({ navigation, route }) => ({ 
                title: 'Info',
                headerLeft: () => <HeaderLeft navigation={navigation} />,
                headerTitle: () => <HeaderTitle route={route} />,
                headerRight: () => <HeaderRight />,
                headerTitleAlign: 'center',
              })} 
            />
            <Stack.Screen 
              name="Alphabet" 
              component={AlphabetScreen} 
              options={({ navigation, route }) => ({ 
                title: 'Alphabet',
                headerLeft: () => <HeaderLeft navigation={navigation} />,
                headerTitle: () => <HeaderTitle route={route} />,
                headerRight: () => <HeaderRight />,
                headerTitleAlign: 'center',
              })} 
            />
            
          </Stack.Navigator>
        </GameProvider>
      </GameDBProvider>
    </NavigationContainer>
  );
};

export default App;
