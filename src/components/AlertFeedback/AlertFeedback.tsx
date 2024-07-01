import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 

import styles from './styles';
import QuizButton from '../QuizButton/QuizButton';

interface AlertFeedbackProps {
  type: 'success' | 'error';
  onClose: () => void;
}

const AlertFeedback: React.FC<AlertFeedbackProps> = ({ type, onClose }) => {
  const isSuccess = type === 'success';

  const handleContinue = () => {
    onClose();
  }

  return (
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: isSuccess? '#D0E6B9' : '#F99292' }]}>
        <View style={styles.containerDetais}>
          <MaterialIcons
            name={isSuccess ? 'check-circle' : 'cancel'}
            size={30}
            color={isSuccess ? '#578626' : '#C12A31'}
          />

          <Text style={[styles.text, { color: isSuccess ? '#578626' : '#C12A31' }]}>
            {isSuccess ? 'Correto! Muito bem.' : 'Ops, resposta errada. '}
          </Text>
        </View>

        <QuizButton color={isSuccess ? '#578626' : '#C12A31'}  colorShadow={isSuccess ? '#60932A' : '#D73138'} text="Continuar" onPress={handleContinue} />
        </View>
      </View>
  );
};


export default AlertFeedback;
