import { useState, useEffect } from 'react';
import { Platform, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'pt' | 'de';

const getDeviceLanguage = (): Language => {
  let locale: Language = 'pt';

  if (Platform.OS === 'ios') {
    const settings = NativeModules.SettingsManager.settings;
    locale = settings.AppleLocale || settings.AppleLanguages[0] || locale;
  } else if (Platform.OS === 'android') {
    locale = NativeModules.I18nManager.localeIdentifier || locale;
  }

  return locale.substring(0, 2) as Language;
};

const useLanguage = (): [Language, (language: Language) => void] => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(getDeviceLanguage());

  useEffect(() => {
    const loadStoredLanguage = async () => {
      const storedLanguage = await AsyncStorage.getItem('appLanguage');
      if (storedLanguage !== null) {
        setSelectedLanguage(storedLanguage as Language);
      }
    };

    loadStoredLanguage();
  }, []);

  useEffect(() => {
    const saveSelectedLanguage = async () => {
      await AsyncStorage.setItem('appLanguage', selectedLanguage);
    };

    saveSelectedLanguage();
  }, [selectedLanguage]);

  const setLanguage = (language: Language) => {
    setSelectedLanguage(language);
  };

  return [selectedLanguage, setLanguage];
};

export default useLanguage;
