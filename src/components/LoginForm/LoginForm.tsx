import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import styles from './styles';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const LoginForm = () => {
    const { signIn, error, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigation = useNavigation<any>();

    const handleSignIn = async () => {
        if (!loading) {
          const success = await signIn(email, password);
          if (success) {
            navigation.navigate('ChoseGroupQuestions');
          }
        }
      };
      

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Olá, seja bem vindo</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
            <Pressable style={styles.button} onPress={handleSignIn} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <>
                        <Text style={styles.text}>Entrar</Text>
                    </>
                )}
            </Pressable>
        </View>
    );
};

export default LoginForm;

