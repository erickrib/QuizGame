import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    button: {
      backgroundColor: '#1356A1',
      paddingVertical: 15,
      borderRadius: 20,
      width: 300, // Largura exata do botão
      marginTop: 'auto',
      borderBottomColor: '#1B79E3',
      borderBottomWidth: 4,
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
  },
  buttonText: {
      fontSize: 24,
      color: '#ffffff',
      fontWeight: 'bold',
      textAlign: 'center',
  },
  divider: {
      position: 'relative',
      height: 0,
      borderBottomColor: '#1B79E3',
      borderBottomWidth: 0.5,
      top: 8,
      width: '98%',
      marginHorizontal: 'auto',
      shadowColor: '#000',
  }
  });

export default styles;