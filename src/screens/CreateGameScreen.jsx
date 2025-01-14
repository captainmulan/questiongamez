import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Modal, Pressable, Alert, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useGameDB } from '../utils/GameDBContext';

const CreateGameScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [remark, setRemark] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswers, setCurrentAnswers] = useState(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [questionType, setQuestionType] = useState('Puzzle'); // Default question type
  const [isChecked, setIsChecked] = useState(false);

  const { createGame } = useGameDB();

  const toggleCheckBox = () => {
    setIsChecked(!isChecked);
  };

  const handleAddQuestion = () => {
    const answers = questionType === 'TrueFalse' ? [
      { text: 'True', correctAnswer: correctAnswerIndex === 0 },
      { text: 'False', correctAnswer: correctAnswerIndex === 1 },
    ] : currentAnswers.map((answer, index) => ({
      text: answer,
      correctAnswer: correctAnswerIndex === index // Set correct answer based on index
    }));

    setQuestions([...questions, {
      text: currentQuestion,
      type: questionType,
      answers: answers
    }]);
    setCurrentQuestion('');
    setCurrentAnswers(['', '', '', '']);
    setCorrectAnswerIndex(null);
  };

  const handleCreateGame = async () => {
    if (!title) {
      Alert.alert('Error', 'Please enter a game title.');
      return;
    }

    try {
      const createdDate = new Date().toISOString();
      const updatedDate = createdDate;

      const pin = await createGame({
        name: title,
        type: 'Classic',
        isPublic: false,
        isPopular: false,
        category: 'MyList',
        subCategory: 'MyList',
        remark: remark,
        createdBy: 'Anonymous',
        createdDate: createdDate,
        updatedBy: 'Anonymous',
        updatedDate: updatedDate,
        ts: createdDate,
        questions: questions
    });

      Alert.alert('Success', 'Game created.', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create game. Please try again later.');
      console.error('CreateGameScreen/handleCreateGame/Error:', error);
    }
  };

  const handleQuestionChange = (text) => {
    setCurrentQuestion(text);
  };

  const handleAnswerChange = (text, index) => {
    const updatedAnswers = [...currentAnswers];
    updatedAnswers[index] = text;
    setCurrentAnswers(updatedAnswers);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(updatedQuestions);
  };

  const handleEditQuestion = (index) => {
    const questionToEdit = questions[index];
    setCurrentQuestion(questionToEdit.text);
    setCurrentAnswers(questionToEdit.answers.map(a => a.text));
    setCorrectAnswerIndex(questionToEdit.answers.findIndex(a => a.correctAnswer));
    handleDeleteQuestion(index);
    setModalVisible(true);
  };

  const toggleQuestionType = (type) => {
    setQuestionType(type);
  };

  const toggleSwitch = (index) => {
    setCorrectAnswerIndex(correctAnswerIndex === index ? null : index);
  };

  const renderQuestionTypeCheckBoxes = () => (
    <View style={styles.checkBoxContainer}>
      <TouchableOpacity
        style={[styles.checkBoxItem, { backgroundColor: questionType === 'Puzzle' ? '#3AA6B9' : '#fff' }]}
        onPress={() => toggleQuestionType('Puzzle')}
      >
        <Text style={styles.checkBoxText}>Puzzle</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.checkBoxItem, { backgroundColor: questionType === 'TrueFalse' ? '#3AA6B9' : '#fff' }]}
        onPress={() => toggleQuestionType('TrueFalse')}
      >
        <Text style={styles.checkBoxText}>True/False</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAnswerInputs = () => {
    if (questionType === 'TrueFalse') {
      return (
        <>
          <View style={styles.answerContainer}>
            <TextInput
              style={styles.answerInput}
              value="True"
              editable={false}
            />
            <TouchableOpacity
              style={[styles.checkBox, { backgroundColor: correctAnswerIndex === 0 ? '#3AA6B9' : '#fff' }]}
              onPress={() => setCorrectAnswerIndex(0)}
            >
              <Text style={styles.checkBoxText}>{correctAnswerIndex === 0 ? '⭕' : '❌'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.answerContainer}>
            <TextInput
              style={styles.answerInput}
              value="False"
              editable={false}
            />
            <TouchableOpacity
              style={[styles.checkBox, { backgroundColor: correctAnswerIndex === 1 ? '#3AA6B9' : '#fff' }]}
              onPress={() => setCorrectAnswerIndex(1)}
            >
              <Text style={styles.checkBoxText}>{correctAnswerIndex === 1 ? '⭕' : '❌'}</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    } else { // Default to Puzzle type with 4 answers


      return currentAnswers.map((answer, index) => (
        <View key={index} style={styles.answerContainer}>
          <TextInput
            style={styles.answerInput}
            value={answer}
            onChangeText={(text) => handleAnswerChange(text, index)}
            placeholder={`Answer ${index + 1}`}
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            style={[styles.checkBox, { backgroundColor: correctAnswerIndex === index ? '#3AA6B9' : '#fff' }]}
            onPress={() => setCorrectAnswerIndex(index)}
          >
            <Text style={styles.checkBoxText}>{correctAnswerIndex === index ? '⭕' : '❌'}</Text>
          </TouchableOpacity>
        </View>
      ));

      // return (
      //   <View>
      //     {currentAnswers.map((answer, index) => (
      //       <View key={index} style={styles.answerContainer}>
      //         <TextInput
      //           style={styles.answerInput}
      //           value={answer}
      //           onChangeText={(text) => handleAnswerChange(text, index)}
      //           placeholder={`Answer ${index + 1}`}
      //           placeholderTextColor="#888"
      //         />
      //         <TouchableOpacity
      //           style={[styles.switchContainer, { backgroundColor: correctAnswerIndex === index ? '#3AA6B9' : '#eee' }]}
      //           onPress={() => toggleSwitch(index)}
      //         >
      //           <Text style={styles.switchText}>{correctAnswerIndex === index ? '⭕' : '❌'}</Text>
      //           <Switch
      //             trackColor={{ false: "#767577", true: "#81b0ff" }}
      //             thumbColor="#f4f3f4"
      //             ios_backgroundColor="#3e3e3e"
      //             onValueChange={() => toggleSwitch(index)}
      //             value={correctAnswerIndex === index}
      //             style={styles.switchControl}
      //           />
      //         </TouchableOpacity>
      //       </View>
      //     ))}
      //   </View>
      // );




    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Game</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter Game Title"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.remarkInput}
          value={remark}
          onChangeText={setRemark}
          placeholder="Enter Remarks"
          placeholderTextColor="#888"
          multiline={true}
          numberOfLines={4}
        />
        <TouchableOpacity
          style={styles.addQuestionsButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.createButtonText}>Add Questions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateGame}
        >
          <Text style={styles.createButtonText}>Create Game</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.questionList}>
        {questions.map((question, index) => (
          <View key={index} style={styles.questionItem}>
            <Text style={styles.questionText}>{question.text}</Text>
            <View style={styles.questionActions}>
              <TouchableOpacity onPress={() => handleEditQuestion(index)}>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteQuestion(index)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView>
              {/* <Picker
                selectedValue={questionType}
                style={styles.picker}
                onValueChange={(itemValue) => setQuestionType(itemValue)}
              >
                <Picker.Item label="Puzzle" value="Puzzle" />
                <Picker.Item label="TrueFalse" value="TrueFalse" />
              </Picker> */}

              {renderQuestionTypeCheckBoxes()}

              <TextInput
                style={styles.questionInput}
                value={currentQuestion}
                onChangeText={handleQuestionChange}
                placeholder="Enter Question"
                placeholderTextColor="#888"
              />
              {renderAnswerInputs()}
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddQuestion}
              >
                <Text style={styles.addButtonText}>Add Question</Text>
              </TouchableOpacity>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF8DC'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  inputContainer: {
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff'
  },
  remarkInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    height: 80
  },
  addQuestionsButton: {
    backgroundColor: '#3AA6B9',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10
  },
  createButton: {
    backgroundColor: '#FFB3B0',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: '#FFF8DC',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: '#FFB3B0',
    marginTop: 10
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  questionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    width: 250
  },
  // answerContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginBottom: 10
  // },
  // answerInput: {
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   padding: 10,
  //   borderRadius: 5,
  //   backgroundColor: '#fff',
  //   flex: 1,
  //   marginRight: 10
  // },
  addButton: {
    backgroundColor: '#3AA6B9',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16
  },
  picker: {
    height: 50,
    width: 250,
    marginBottom: 10
  },
  questionList: {
    marginTop: 20,
  },
  questionItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10
  },
  questionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  editButton: {
    color: '#007bff',
    fontSize: 16
  },
  deleteButton: {
    color: '#dc3545',
    fontSize: 16
  },
  checkBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  // checkBoxText: {
  //   fontSize: 24,
  // },

  checkBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  checkBoxItem: {
    width: '45%',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  checkBoxText: {
    color: 'black',
    fontWeight: 'bold',
    
  },

  answerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  answerInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  switchText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 10,
  },
  switchControl: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
});

export default CreateGameScreen;
