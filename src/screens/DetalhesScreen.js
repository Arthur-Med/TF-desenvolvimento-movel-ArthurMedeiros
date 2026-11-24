import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

function primeiraLetraMaiuscula(texto) {
  if (!texto) {
    return '';
  }
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export default function DetalhesScreen({ route, navigation }) {
  const { id, nome } = route.params || {};

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.card}>
        <MaterialIcons name="catching-pokemon" size={48} color="#DC0A2D" />

        <Text style={styles.titulo}>
          {nome ? primeiraLetraMaiuscula(nome) : 'Detalhes do Pokémon'}
        </Text>

        {id ? (
          <Text style={styles.numero}>
            #{String(id).padStart(3, '0')}
          </Text>
        ) : null}

        <Text style={styles.descricao}>
          Os detalhes completos (status, golpes, cadeia evolutiva e favorito)
          serão construídos na próxima etapa do projeto.
        </Text>

        <TouchableOpacity
          style={styles.botao}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoBotao}>Voltar para a Pokédex</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 12,
  },
  numero: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#DC0A2D',
    marginTop: 4,
  },
  descricao: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  botao: {
    backgroundColor: '#DC0A2D',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
