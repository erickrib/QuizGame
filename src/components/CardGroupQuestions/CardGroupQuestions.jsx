import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import  styles from './styles';

const CardGroupQuestions = ({ onPress, text }) => {

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View>
                <Text style={styles.text}>{text}</Text>
            </View>   
        </TouchableOpacity>
    );
}

export default CardGroupQuestions;