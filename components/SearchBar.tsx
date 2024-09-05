import Colors from '@constants/Colors';
import { TextInput, StyleSheet } from 'react-native';

interface SearchBarProps {
  search: string;
  setSearch: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ search, setSearch, placeholder }: SearchBarProps) {
  return (
    <TextInput
      style={styles.search}
      placeholder={placeholder}
      placeholderTextColor={Colors.INACTIVE}
      onChangeText={(text) => setSearch(text)}
      value={search}
    />
  );
}

const styles = StyleSheet.create({
  search: {
    width: '100%',
    backgroundColor: Colors.SEARCHBAR,
    borderRadius: 10,
    padding: 10,
    color: Colors.WHITE,
  },
});