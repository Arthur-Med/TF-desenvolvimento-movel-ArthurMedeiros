import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import BotaoAtalho from '../components/BotaoAtalho';
import { CORES_TIPOS } from '../coresTipos';

const CHAVE_FAVORITOS = 'pokemons_favoritos';

function primeiraLetraMaiuscula(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export default function InicioScreen({ navigation }) {
  const [pokemon, setPokemon] = useState(null);
  const [favorito, setFavorito] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const verificarFavorito = async (idPokemon) => {
    const salvos = await AsyncStorage.getItem(CHAVE_FAVORITOS);
    const lista = salvos ? JSON.parse(salvos) : [];
    setFavorito(lista.some((item) => item.id === idPokemon));
  };

  const sortearPokemon = () => {
    setIsLoading(true);
    setError(null);

    const idSorteado = Math.floor(Math.random() * 151) + 1;

    fetch(`https://pokeapi.co/api/v2/pokemon/${idSorteado}`)
      .then((resposta) => {
        if (!resposta.ok) {
          throw new Error('Não foi possível carregar o Pokémon.');
        }
        return resposta.json();
      })
      .then((dados) => {
        const pokemonFormatado = {
          id: dados.id,
          nome: dados.name,
          imagem:
            dados.sprites.other['official-artwork'].front_default ||
            dados.sprites.front_default,
          tipos: dados.types.map((t) => t.type.name),
        };
        setPokemon(pokemonFormatado);
        verificarFavorito(dados.id);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    sortearPokemon();
  }, []);

  useEffect(() => {
    const sair = navigation.addListener('focus', () => {
      if (pokemon) verificarFavorito(pokemon.id);
    });
    return sair;
  }, [navigation, pokemon]);

  const alternarFavorito = async () => {
    const novoValor = !favorito;
    setFavorito(novoValor);

    const salvos = await AsyncStorage.getItem(CHAVE_FAVORITOS);
    const lista = salvos ? JSON.parse(salvos) : [];
    const semAtual = lista.filter((item) => item.id !== pokemon.id);

    if (novoValor) {
      const novo = {
        id: pokemon.id,
        nome: pokemon.nome,
        imagem: pokemon.imagem,
      };
      await AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify([...semAtual, novo]));
    } else {
      await AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(semAtual));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.bannerPokedex}>
          <Image
            source={require('../../assets/pokedex.png')}
            style={styles.imagemPokedex}
            resizeMode="contain"
          />
          <Text style={styles.tituloBanner}>Pokedex e Batalha</Text>
        </View>

        <Text style={styles.tituloSecao}>Pokémon em Destaque do Dia</Text>

        <View style={styles.cardDestaque}>
          {isLoading ? (
            <View style={styles.areaCentralizada}>
              <ActivityIndicator size="large" color="#DC0A2D" />
              <Text style={styles.textoCarregando}>Sorteando Pokémon...</Text>
            </View>
          ) : error ? (
            <View style={styles.areaCentralizada}>
              <MaterialIcons name="error-outline" size={40} color="#DC0A2D" />
              <Text style={styles.textoErro}>{error}</Text>
              <TouchableOpacity
                style={styles.botaoSortear}
                activeOpacity={0.7}
                onPress={sortearPokemon}
              >
                <Text style={styles.textoBotaoSortear}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          ) : pokemon ? (
            <View style={styles.conteudoPokemon}>
              <View style={styles.topoCard}>
                <Text style={styles.numeroPokemon}>
                  #{String(pokemon.id).padStart(3, '0')}
                </Text>
                <View style={styles.listaTipos}>
                  {pokemon.tipos.map((t) => (
                    <View
                      key={t}
                      style={[
                        styles.badgeTipo,
                        { backgroundColor: CORES_TIPOS[t] || '#64748B' },
                      ]}
                    >
                      <Text style={styles.textoTipo}>
                        {primeiraLetraMaiuscula(t)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={styles.areaPokemon}
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('Detalhes', {
                    id: pokemon.id,
                    nome: pokemon.nome,
                  })
                }
              >
                <Image
                  source={{ uri: pokemon.imagem }}
                  style={styles.imagemPokemon}
                  resizeMode="contain"
                />

                <Text style={styles.nomePokemon}>
                  {primeiraLetraMaiuscula(pokemon.nome)}
                </Text>
              </TouchableOpacity>

              <View style={styles.rodapeCard}>
                <TouchableOpacity
                  style={styles.botaoSortear}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  onPress={sortearPokemon}
                >
                  <MaterialIcons name="refresh" size={18} color="#FFFFFF" />
                  <Text style={styles.textoBotaoSortear}>Sortear</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={1}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  onPress={alternarFavorito}
                >
                  <MaterialIcons
                    name={favorito ? 'star' : 'star-border'}
                    size={30}
                    color={favorito ? '#F59E0B' : '#94A3B8'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </View>

        <BotaoAtalho
          titulo="Pokédex"
          cor="#DC0A2D"
          onPress={() => navigation.navigate('Pokedex')}
        />

        <BotaoAtalho
          titulo="Batalhar"
          cor="#F59E0B"
          onPress={() => navigation.navigate('Batalha')}
        />
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
    paddingBottom: 32,
  },
  bannerPokedex: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 22,
  },
  imagemPokedex: {
    width: 110,
    height: 85,
    marginRight: 14,
  },
  tituloBanner: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 10,
  },
  cardDestaque: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  areaCentralizada: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  textoCarregando: {
    marginTop: 10,
    fontSize: 14,
    color: '#64748B',
  },
  textoErro: {
    marginTop: 8,
    marginBottom: 14,
    fontSize: 14,
    color: '#DC0A2D',
    textAlign: 'center',
  },
  conteudoPokemon: {
    alignItems: 'center',
  },
  topoCard: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  numeroPokemon: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#64748B',
  },
  listaTipos: {
    flexDirection: 'row',
    gap: 6,
  },
  badgeTipo: {
    backgroundColor: '#64748B',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  textoTipo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  areaPokemon: {
    alignItems: 'center',
    width: '100%',
  },
  imagemPokemon: {
    width: 150,
    height: 150,
    marginVertical: 8,
  },
  nomePokemon: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  rodapeCard: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  botaoSortear: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC0A2D',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  textoBotaoSortear: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});
