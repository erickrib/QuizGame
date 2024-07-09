import React from 'react';
import LoginForm from '../components/LoginForm/LoginForm';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginView: React.FC = () => {
  return (
    <SafeAreaView>
        <LoginForm />
    </SafeAreaView>
  );
};

export default LoginView;