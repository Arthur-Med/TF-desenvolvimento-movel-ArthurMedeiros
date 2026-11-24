import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

function primeiraLetraMaiuscula(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Componente reutilizável de card da Pokédex
export default function CardPokemon(props) {
  const { pokemon, onPress, style } = props;

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Text style={styles.numero}>
        #{String(pokemon.id).padStart(3, '0')}
      </Text>

      <Image
        source={{ uri: pokemon.imagem }}
        style={styles.imagem}
        resizeMode="contain"
      />

      <Text style={styles.nome} numberOfLines={1}>
        {primeiraLetraMaiuscula(pokemon.nome)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  numero: {
    alignSelf: 'flex-end',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
  },
  imagem: {
    width: 96,
    height: 96,
    marginVertical: 6,
  },
  nome: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1E293B',
  },
});
