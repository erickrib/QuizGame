import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semi-transparente
    },
    modalView: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      margin: 20,
      alignItems: 'center',
      elevation: 5, // Sombreamento no Android
    },
    modalText: {
      marginBottom: 25,
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      color: '#4B4B4B',
    },
    subText: {
      marginBottom: 60,
      textAlign: 'center',
      fontSize: 16,
      color: '#4B4B4B',
    },
    buttonContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      width: '100%',
      gap: 15,
    },
    cancelButton: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      paddingHorizontal: 10, // Espaçamento interno horizontal para o botão "X"
      marginLeft: 'auto',
      marginBottom: 20,
    },
    cancelButtonText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#FF3D3D'
    }
  });
  
  export default styles;
  