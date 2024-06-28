import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 20,
      marginHorizontal: 15,
    },
    progressBar: {
      flex: 1,
      height: 16,
      borderRadius: 10,
      backgroundColor: '#ddd',
      overflow: 'hidden',
    },
    progress: {
      height: 16,
      backgroundColor: '#3498db',
      borderRadius: 10,
    },
    cancelButton: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      paddingHorizontal: 10, // Espaçamento interno horizontal para o botão "X"
    },
    cancelButtonText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#FF3D3D',
    }
  });
  
  export default styles;