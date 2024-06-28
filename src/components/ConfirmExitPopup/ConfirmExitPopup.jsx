import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import QuizButton from '../QuizButton/QuizButton';
import styles from './styles';

const ConfirmExitPopup = ({ isVisible, onConfirm, onCancel, title, descricao = "", confirmButtonTitle, cancelButtonTitle, showCancelButton = true }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.modalText}>{title}</Text>
          <Text style={styles.subText}>{descricao}</Text>

          <View style={styles.buttonContainer}>
            <QuizButton onPress={onConfirm} text={cancelButtonTitle} color='#1356A1' colorShadow='#1356A1' />
            {showCancelButton && (
              <QuizButton onPress={onCancel} text={confirmButtonTitle} color="#C12A31" colorShadow="#AA292F" />
            )}
            <TouchableOpacity />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmExitPopup