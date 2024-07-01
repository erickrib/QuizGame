import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import styles from './styles';

interface CardGroupQuestionsProps {
    onPress: () => void;
    text: string;
}

const CardGroupQuestions: React.FC<CardGroupQuestionsProps> = ({ onPress, text }) => {

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View>
                <Text style={styles.text}>{text}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default CardGroupQuestions;