import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'absolute',
        width: '100%',
        height: '100%'

    },
    container: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        margin: 5,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerDetais: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default styles;