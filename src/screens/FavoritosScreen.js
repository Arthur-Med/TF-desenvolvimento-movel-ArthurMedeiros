import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardPokemon from '../components/CardPokemon';

const CHAVE_FAVORITOS = 'pokemons_favoritos';

export default function FavoritosScreen({ navigation }) {
  const [favoritos, setFavoritos] = useState([]);

  const carregarFavoritos = async () => {
    const salvos = await AsyncStorage.getItem(CHAVE_FAVORITOS);
    setFavoritos(salvos ? JSON.parse(salvos) : []);
  };

  useEffect(() => {
    carregarFavoritos();
    const sair = navigation.addListener('focus', carregarFavoritos);
    return sair;
  }, [navigation]);

  const removerFavorito = async (id) => {
    const novaLista = favoritos.filter((item) => item.id !== id);
    setFavoritos(novaLista);
    await AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(novaLista));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <FlatList
        data={favoritos}
        numColumns={2}
        keyExtractor={(item) => String(item.id)}
        columnWrapperStyle={styles.linhaGrid}
        contentContainerStyle={
          favoritos.length === 0 ? styles.vazioContainer : styles.grid
        }
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.tituloVazio}>Nenhum Pokémon favoritado</Text>
            <Text style={styles.textoVazio}>
              Abra um Pokemon na Pokedex e toque na estrela para ele aparecer aqui.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <CardPokemon
            pokemon={item}
            onPress={() =>
              navigation.navigate('Detalhes', { id: item.id, nome: item.nome })
            }
            onRemover={() => removerFavorito(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  grid: {
    padding: 14,
  },
  linhaGrid: {
    justifyContent: 'space-between',
  },
  vazioContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  vazio: {
    alignItems: 'center',
  },
  tituloVazio: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 10,
  },
  textoVazio: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
  },
});
