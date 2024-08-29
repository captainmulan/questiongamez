import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Clipboard, Alert, ScrollView, Modal, TextInput, Pressable } from 'react-native';

const InfoScreen = ({ navigation }) => {
  const [adminPwdModalVisible, setAdminPwdModalVisible] = useState(false);
  const [adminPwd, setAdminPwd] = useState('');

  const copyToClipboard = () => {
    Clipboard.setString('xxxxx');
    Alert.alert('Copied to Clipboard', 'Account number has been copied to your clipboard.');
  };

  const handleSetting = () => {
    setAdminPwdModalVisible(true);
  }

  const verifyAdminPwd = () => {
    if (adminPwd === 'admin123') {
      setAdminPwdModalVisible(false);
      navigation.navigate('Setting');
    } else {
      Alert.alert('Error', 'Incorrect Admin Password');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Rich Text Box */}
      <View style={styles.richTextBox}>
        <Text style={styles.richTextTitle}>Support Our Game</Text>
        <Text style={styles.richText}>
          If you enjoy the game, please consider contributing to the production team. 
          This game aims to assist the Myanmar community in improving life skills and knowledge, 
          and to foster a deeper understanding of Myanmar culture.
        </Text>
      </View>

      {/* Aligning Account Number and Settings Button */}
      <View style={styles.infoContainer}>
        <TouchableOpacity onPress={copyToClipboard} style={styles.infoItem}>
          <Text style={styles.accountLabel}>Account no: (DBS) 017-3-103684</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoItem} onPress={handleSetting}>
          <Text style={styles.linkText}>Go to Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Admin Password Modal */}
      <Modal animationType="slide" transparent visible={adminPwdModalVisible} onRequestClose={() => setAdminPwdModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter Admin Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Admin Password"
              secureTextEntry
              value={adminPwd}
              onChangeText={setAdminPwd}
            />
            <View style={styles.modalButtonContainer}>
              <Pressable style={styles.modalButton} onPress={verifyAdminPwd}>
                <Text style={styles.modalButtonText}>Submit</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={() => setAdminPwdModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF8DC',
  },
  richTextBox: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  richTextTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  richText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  infoContainer: {
    marginTop: 20,
    marginLeft: 15,
  },
  infoItem: {
    marginBottom: 60,
  },
  accountLabel: {
    fontSize: 18,
    color: '#007BFF',
  },
  linkText: {
    fontSize: 16,
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#3AA6B9',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFB3B0',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 18,
  },
});

export default InfoScreen;
