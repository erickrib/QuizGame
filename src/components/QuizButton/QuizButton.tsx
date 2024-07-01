import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import styles from './styles';

interface QuizButtonProps {
  onPress: () => void;
  text: string;
  color?: string;
  colorShadow?: string;
}

const QuizButton:React.FC<QuizButtonProps> = ({ onPress, text, color = '#1356A1', colorShadow = '#328AE1' }) => {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: color, borderBottomColor: colorShadow }]} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
        <View style={[styles.divider, { borderBottomColor: colorShadow }]} />
    </TouchableOpacity>
  );
};

export default QuizButton;