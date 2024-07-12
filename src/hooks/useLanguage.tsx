import { useState } from 'react';
import { Platform, NativeModules } from 'react-native';

export type Language = 'en' | 'pt' | 'de';

const getDeviceLanguage = (): Language => {
  let locale: Language = 'pt';

  if (Platform.OS === 'ios') {
    const settings = NativeModules.SettingsManager.settings;
    locale = settings.AppleLocale || settings.AppleLanguages[0] || locale;
  } else if (Platform.OS === 'android') {
    locale = NativeModules.I18nManager.localeIdentifier || locale;
  }

  return locale.substring(0, 2) as Language; // converte string linguagem: 'en-US' -> 'en'
};

const useLanguage = (): [Language, (language: Language) => void] => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(getDeviceLanguage());

  const setLanguage = (language: Language) => {
    setSelectedLanguage(language);
    
  };

  return [selectedLanguage, setLanguage];
};

export default useLanguage;