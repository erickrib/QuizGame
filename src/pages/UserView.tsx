import React, { useEffect, useState } from 'react';
import { Alert, Button, SafeAreaView, View } from 'react-native';
import UserList from '../components/UserList/UserList';
import AddUserForm from '../components/AddUserForm/AddUserForm';
import { profileUserService } from '../services';
import { CreateProfileUserParams } from '../services/ProfileUserService';
import { PerfilUsuario } from '../models/ProfileUser';
import { useNavigation } from '@react-navigation/native';

const UserView: React.FC = () => {
  const [usuarios, setUsuarios] = useState<PerfilUsuario[]>([]);
  const [selectedUsuario, setSelectedUsuario] = useState<PerfilUsuario>(null);
  const [isUsuarioSelected, setIsUsuarioSelected] = useState<boolean>(false);

  const navigation = useNavigation<any>();

  const handleNavigate = () => { 
    
    console.log('selectedUsuario:', selectedUsuario);
    
        
    if (!isUsuarioSelected) {
      Alert.alert('Não foi possível continuar', 'Adicione um novo usuário ou selecione um existente');
      return;
    }

    navigation.navigate('ChoseGroupQuestions', { user: selectedUsuario });
  };

  const fetchUsuarios = async () => {
    const users = await profileUserService.fetchAll();
    setUsuarios(users);
    setSelectedUsuario(users[0]);
    setIsUsuarioSelected(true);

  };

  const handleAddUsuario = async (params: CreateProfileUserParams) => {
    const newUser = await profileUserService.create(params);
    setUsuarios([...usuarios, newUser]);
  };

  const handleSelectUsuario = (usuario: PerfilUsuario) => {  
    setSelectedUsuario(usuario);
    setIsUsuarioSelected(true);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);
  

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: 10 }}>
          <Button onPress={handleNavigate} title="Continuar" />
        </View>
      ),
    });
  }, [navigation, isUsuarioSelected, selectedUsuario]);

  return (
    <SafeAreaView>
      <View>
        <UserList usuarios={usuarios} onSelectUsuario={handleSelectUsuario} selectedUser={selectedUsuario} />
        <AddUserForm onAddUsuario={handleAddUsuario} />
      </View>
    </SafeAreaView>
  );
};

export default UserView;
