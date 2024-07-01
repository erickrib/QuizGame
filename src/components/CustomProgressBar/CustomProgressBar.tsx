import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, DimensionValue } from 'react-native';
import styles from './styles';

interface CustomProgressBarProps {
  progress: number;
  close: () => void;
}

const CustomProgressBar: React.FC<CustomProgressBarProps> = ({ progress, close }) => {
  const handleCancel = () => {
    close();
  };

  const progressWidth: DimensionValue = `${(progress / 10) * 100}%`;

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

export default CustomProgressBar;


