import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SobreScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.titulo}>Pokedex e Batalha</Text>
          <Text style={styles.descricao}>
            Aplicativo de Pokédex da 1ª geração. Permite explorar os 151
            Pokémon, filtrar por tipo, consultar detalhes, salvar nos
            favoritos e simular batalhas.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Criador</Text>
          <Text style={styles.valor}>Arthur José Barbosa Medeiros</Text>

          <View style={styles.separador} />

          <Text style={styles.label}>Matéria</Text>
          <Text style={styles.valor}>Desenvolvimento Móvel</Text>

          <View style={styles.separador} />

          <Text style={styles.label}>Tecnologias Utilizadas</Text>
          <Text style={styles.valor}>
            React Native, Expo, React Navigation, AsyncStorage e Fetch API
          </Text>

          <View style={styles.separador} />

          <Text style={styles.label}>API</Text>
          <Text style={styles.valor}>
           PokéAPI v2 (pokeapi.co)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#DC0A2D',
    marginBottom: 8,
  },
  descricao: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#64748B',
  },
  valor: {
    fontSize: 15,
    color: '#1E293B',
    marginTop: 4,
    lineHeight: 22,
  },
  separador: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
});
