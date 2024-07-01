import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import styles from './styles';

interface AnswerOptionProps {
  answer: string;
  onPress: (answer: string) => void;
  isActive: boolean;
}

const AnswerOption: React.FC<AnswerOptionProps> = ({ isActive, answer, onPress }) => {

  const handleClicked = () => {
    onPress(answer);
  }

  return (
    <TouchableOpacity style={[styles.gridItem, { backgroundColor: isActive ? '#1356A1' : '#f0f0f0' }]} onPress={handleClicked}>
      <Text style={[styles.gridItemText, { color: isActive ? '#fff' : '#333' }]}>{answer}</Text>
    </TouchableOpacity>
  );
}

export default AnswerOption;
