import React, { useState } from 'react';
import { Button, TextInput, View, StyleSheet, Pressable, Text } from 'react-native';
import { CreateUserParams } from '../../services/ProfileUserService';

interface Props {
  onAddUsuario: (params: CreateUserParams) => void;
}

const AddUserForm: React.FC<Props> = ({ onAddUsuario }) => {
  const [nome, setNome] = useState('');

  const handleAddUsuario = () => {
    if (nome.trim() !== '') {
      // onAddUsuario({ nome });
      setNome('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome do usuário"
        value={nome}
        onChangeText={(text) => setNome(text)}
      />
      <Pressable style={styles.button} onPress={handleAddUsuario}>
         <Text style={styles.text}>Adicionar</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 40,
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
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

export default AddUserForm;
