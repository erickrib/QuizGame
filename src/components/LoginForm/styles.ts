import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 60,
        marginTop: 20,
        textAlign: 'center',
    },
    input: {
        height: 60,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#FFF',
      },
      button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: '#1356A1',
        maxWidth: 200,
        marginHorizontal: 'auto',
      },
      text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
      }, 
      errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
      }
  });

  export default styles;