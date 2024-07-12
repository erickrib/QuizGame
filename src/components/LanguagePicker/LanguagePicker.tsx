import React from 'react';
import { Picker } from '@react-native-picker/picker';

type LanguageSelectorProps = {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onLanguageChange }) => {
  return (
    <Picker
      selectedValue={selectedLanguage}
      style={{ width: 300 }}
      onValueChange={(itemValue, itemIndex) =>
        onLanguageChange(itemValue)
      }>
      <Picker.Item label="English" value="en" />
      <Picker.Item label="Português" value="pt" />
      <Picker.Item label="Deutsch" value="de" />
    </Picker>
  );
};

export default LanguageSelector;
