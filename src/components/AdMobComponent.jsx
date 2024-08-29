// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
// import { AdMobBanner, TestIds } from 'expo-ads-admob';

// const SettingScreen = ({ navigation }) => {
//   const [modalVisible, setModalVisible] = useState(false);

//   const adUnitId = TestIds.BANNER; // Use test ID during development

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Settings</Text>

//       {/* Button to show ad testing modal */}
//       <TouchableOpacity style={styles.showAdButton} onPress={() => setModalVisible(true)}>
//         <Text style={styles.buttonText}>Ad Testing</Text>
//       </TouchableOpacity>

//       {/* Modal for displaying the ad */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <Text style={styles.modalTitle}>Ad Banner Test</Text>
//             <AdMobBanner
//               bannerSize="banner"
//               adUnitID={adUnitId}
//               servePersonalizedAds={true}
//               onDidFailToReceiveAdWithError={(error) => console.error('Ad failed to load', error)}
//             />
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => setModalVisible(false)}
//             >
//               <Text style={styles.closeButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFF9C4',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   title: {
//     fontSize: 48,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 40,
//   },
//   showAdButton: {
//     width: '80%',
//     height: 50,
//     backgroundColor: 'green',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 22,
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     width: '90%',
//   },
//   modalTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   closeButton: {
//     marginTop: 20,
//     width: '80%',
//     height: 50,
//     backgroundColor: '#2196F3',
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default SettingScreen;
