import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    gridItem: {
        width: '48%', 
        height: 90,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        marginBottom: 20, 
    },
    gridItemText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default styles;