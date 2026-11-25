import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function BotaoAtalho(props) {
  return (
    <TouchableOpacity
      style={[
        styles.botao,
        { backgroundColor: props.cor || '#DC0A2D' },
        props.style,
      ]}
      activeOpacity={0.7}
      onPress={props.onPress}
    >
      <Text style={styles.titulo}>{props.titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 12,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
