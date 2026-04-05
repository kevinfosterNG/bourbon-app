import { StyleSheet, TextInput, View } from 'react-native';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function BottleSearch({ value, onChange }: Props) {
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Search by bottle or distillery"
        placeholderTextColor="#6b7280"
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#1f2937',
    color: '#f9fafb',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
});
