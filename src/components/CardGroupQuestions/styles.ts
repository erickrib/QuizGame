import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#328AE1',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 20,
        width: 175, 
        height: 200, 
        marginTop: 'auto',
        marginBottom: 50,
        borderBottomColor: '#1356A1',
        borderBottomWidth: 6,
        borderColor: '#1356A1',
        borderWidth: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        padding: 20,
    },
    text: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 'auto',
        lineHeight: 30
    },
    }
);

export default styles;