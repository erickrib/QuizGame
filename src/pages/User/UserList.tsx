import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { PerfilUsuario } from '../../models/ProfileUser';
import { MaterialIcons } from '@expo/vector-icons';

interface Props {
    usuarios: PerfilUsuario[];
    onSelectUsuario: (usuario: PerfilUsuario) => void;
    selectedUser: PerfilUsuario | null;
}

const UserList: React.FC<Props> = ({ usuarios, onSelectUsuario, selectedUser }) => {

    const handleSelectUsuario = (usuario: PerfilUsuario) => {
        onSelectUsuario(usuario);
    }

    return (
        <>
        <Text style={styles.title}>Selecione um usuário para continuar</Text>
        <FlatList
            data={usuarios}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelectUsuario(item)}>
                    <View style={[styles.card, { backgroundColor: selectedUser == item ? '#328AE1' : '#fff'}]}>
                        <MaterialIcons name='account-circle' size={24} color="orange" />
                        <Text style={[styles.userName, { color: selectedUser == item ? '#fff' : '#000'}]}>{item.nome}</Text>
                    </View>
                </TouchableOpacity>
            )}
        />
        </>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 40,
        textAlign: 'center',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        marginHorizontal: 20,
    },
    userName: {
        marginLeft: 10,
        fontSize: 24,
        fontWeight: 'bold',
    },
});


export default UserList;
