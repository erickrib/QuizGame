import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import styles from './styles';

export default CustomProgressBar = ({ progress, close }) => {
  const handleCancel = () => {
    close();
  };

  const progressWidth = `${(progress / 10) * 100}%`;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
        <Text style={styles.cancelButtonText}>X</Text>
      </TouchableOpacity>
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: progressWidth }]} />
      </View>
    </View>
  );
};

