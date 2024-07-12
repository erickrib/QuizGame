import React from 'react';
import { View, Button, StyleSheet, Platform, NativeModules } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LanguageSelector from '../components/LanguagePicker/LanguagePicker';
import useLanguage,  { Language } from '../hooks/useLanguage';

const SettingsView: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useLanguage();
  const navigation = useNavigation<any>();

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
  };

  const handleNavigate = () => {
    navigation.navigate('HomeView');
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ marginRight: 10 }}>
          <Button onPress={handleNavigate} title="Continuar" />
        </View>
      ),
    });
  }, [navigation, selectedLanguage]);

  return (
    <View style={styles.container}>
      <LanguageSelector
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
});

export default SettingsView;
