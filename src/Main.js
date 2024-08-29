// import React, { useContext } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { View, Text, TouchableOpacity } from 'react-native';
// import 'react-native-get-random-values';

// import { GameProvider, GameContext } from './context/GameContext';
// import { GameDBProvider } from './utils/GameDBContext';
// import JoinGameScreen from './screens/JoinGameScreen';
// import PlayGameScreen from './screens/PlayGameScreen';
// import FinalResultScreen from './screens/FinalResultScreen';
// import HomeScreen from './screens/HomeScreen';
// import CreateGameScreen from './screens/CreateGameScreen';
// import SettingScreen from './screens/SettingScreen';
// import LoadingHomeScreen from './screens/LoadingHomeScreen';
// import LoadingPlayerScreen from './screens/LoadingPlayerScreen';
// import CreateGameByBatchScreen from './screens/CreateGameByBatchScreen';
// import GameDetailScreen from './screens/GameDetailScreen';
// import ModifyImageScreen from './screens/ModifyImageScreen';
// import SearchGameScreen from './screens/SearchGameScreen';

// const Stack = createStackNavigator();

// const Main = () => {

//   const HeaderLeft = ({ navigation }) => {
//     const { setGameState } = useContext(GameContext);
    
//     const handleHomePress = () => {
//       setGameState({
//         currentQuestionIndex: 0,
//         questions: [],
//         players: [],
//         pin: '',
//         title: '',
//         gameType: '',
//       });
//       navigation.navigate('Home');
//     };

//     return (
//       <TouchableOpacity style={{ marginLeft: 15 }} onPress={handleHomePress}>
//         <Text style={{ fontSize: 24 }}>🏠</Text>
//       </TouchableOpacity>
//     );
//   };

//   const HeaderTitle = ({ route }) => (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: 40 }}>
//       <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>{route?.name}</Text>
//     </View>
//   );

//   const HeaderRight = () => (
//     <View style={{ flexDirection: 'row', marginRight: 7 }}>
//       <TouchableOpacity style={{ paddingHorizontal: 10 }}>
//         <Text style={{ fontSize: 20 }}>🌐</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={{ paddingHorizontal: 10 }}>
//         <Text style={{ fontSize: 20 }}>👤</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <NavigationContainer>
//       <GameDBProvider>
//         <GameProvider>
//           <Stack.Navigator initialRouteName="LoadingHome">
//             <Stack.Screen 
//               name="LoadingHome" 
//               component={LoadingHomeScreen} 
//               options={{ headerShown: false }} // Hide the header
//             />
//             <Stack.Screen 
//               name="LoadingPlayer" 
//               component={LoadingPlayerScreen} 
//               options={{ headerLeft: null }} // Hide the back button
//             />
            
//             <Stack.Screen 
//               name="Home" 
//               component={HomeScreen} 
//               options={({ navigation, route }) => ({ 
//                 headerLeft: () => <HeaderLeft navigation={navigation} />,
//                 headerTitle: () => <HeaderTitle route={route} />,
//                 headerRight: () => <HeaderRight />,
//                 headerTitleAlign: 'center',
//               })} 
//             />

//             <Stack.Screen 
//               name="Create" 
//               component={CreateGameScreen}
//               options={({ navigation, route }) => ({
//                 headerLeft: () => <HeaderLeft navigation={navigation} />,
//                 headerTitle: () => <HeaderTitle route={route} />,
//                 headerRight: () => <HeaderRight />,
//                 headerTitleAlign: 'center',
//               })}
//             />
//             <Stack.Screen 
//               name="JoinGame" 
//               component={JoinGameScreen}
//               options={({ navigation, route }) => ({
//                 headerLeft: () => <HeaderLeft navigation={navigation} />,
//                 headerTitle: () => <HeaderTitle route={route} />,
//                 headerRight: () => <HeaderRight />,
//                 headerTitleAlign: 'center',
//               })}
//             />
//             <Stack.Screen 
//               name="PlayGame" 
//               component={PlayGameScreen}
//               options={({ navigation, route }) => ({
//                 headerLeft: () => <HeaderLeft navigation={navigation} />,
//                 headerTitle: () => <HeaderTitle route={route} />,
//                 headerRight: () => <HeaderRight />,
//                 headerTitleAlign: 'center',
//               })}
//             />
//             <Stack.Screen 
//               name="SearchGame" 
//               component={SearchGameScreen}
//               options={({ navigation, route }) => ({
//                 headerLeft: () => <HeaderLeft navigation={navigation} />,
//                 headerTitle: () => <HeaderTitle route={route} />,
//                 headerRight: () => <HeaderRight />,
//                 headerTitleAlign: 'center',
//               })}
//             />
//             <Stack.Screen 
//               name="Setting" 
//               component={SettingScreen}
//               options={({ navigation, route }) => ({
//                 headerLeft: () => <HeaderLeft navigation={navigation} />,
//                 headerTitle: () => <HeaderTitle route={route} />,
//                 headerRight: () => <HeaderRight />,
//                 headerTitleAlign: 'center',
//               })}
//             />            
//             <Stack.Screen 
//               name="FinalResult" 
//               component={FinalResultScreen}
//               options={({ navigation, route }) => ({
//                 headerLeft: () => <HeaderLeft navigation={navigation} />,
//                 headerTitle: () => <HeaderTitle route={route} />,
//                 headerRight: () => <HeaderRight />,
//                 headerTitleAlign: 'center',
//               })}
//             />
//             <Stack.Screen 
//               name="CreateGameByBatch" 
//               component={CreateGameByBatchScreen}
//               options={({ navigation, route }) => ({
//                 headerLeft: () => <HeaderLeft navigation={navigation} />,
//                 headerTitle: () => <HeaderTitle route={route} />,
//                 headerRight: () => <HeaderRight />,
//                 headerTitleAlign: 'center',
//               })}
//             />
//             <Stack.Screen 
//               name="GameDetail" 
//               component={GameDetailScreen} 
//               options={({ navigation, route }) => ({ 
//                 title: 'Game Detail',
//                 headerLeft: () => <HeaderLeft navigation={navigation} />,
//                 headerTitle: () => <HeaderTitle route={route} />,
//                 headerRight: () => <HeaderRight />,
//                 headerTitleAlign: 'center',
//               })} 
//             />
//             <Stack.Screen 
//               name="ModifyImage" 
//               component={ModifyImageScreen} 
//               options={({ navigation, route }) => ({ 
//                 title: 'Modify Image',
//                 headerLeft: () => <HeaderLeft navigation={navigation} />,
//                 headerTitle: () => <HeaderTitle route={route} />,
//                 headerRight: () => <HeaderRight />,
//                 headerTitleAlign: 'center',
//               })} 
//             />
            
//           </Stack.Navigator>
//         </GameProvider>
//       </GameDBProvider>
//     </NavigationContainer>
//   );
// };

// export default Main;
