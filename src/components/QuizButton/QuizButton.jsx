import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import styles from './styles';

export default QuizButton = ({ onPress, text, color = '#1356A1', colorShadow = '#328AE1' }) => {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: color, borderBottomColor: colorShadow }]} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
        <View style={[styles.divider, { borderBottomColor: colorShadow }]} />
    </TouchableOpacity>
  );
};
