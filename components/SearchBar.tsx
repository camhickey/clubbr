import Colors from '@constants/Colors';
import { StyleSheet, TextInput } from 'react-native';

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
      placeholderTextColor={Colors.SUBTEXT}
      onChangeText={(text) => setSearch(text)}
      value={search}
    />
  );
}

const styles = StyleSheet.create({
  search: {
    width: '100%',
    backgroundColor: Colors.INPUT,
    borderRadius: 10,
    padding: 10,
    color: Colors.WHITE,
  },
});
