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
import { MaterialIcons } from '@expo/vector-icons';
import BotaoAtalho from '../components/BotaoAtalho';

function primeiraLetraMaiuscula(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export default function InicioScreen({ navigation }) {
  const [pokemon, setPokemon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const sortearPokemon = () => {
    setIsLoading(true);
    setError(null);

    // Sorteia o pokemon
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
          tipo: dados.types[0].type.name,
        };
        setPokemon(pokemonFormatado);
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.bannerPokedex}>
          <View style={styles.linhaLuzes}>
            <View style={styles.lenteAzul} />
            <View style={[styles.luzPequena, { backgroundColor: '#EF4444' }]} />
            <View style={[styles.luzPequena, { backgroundColor: '#FACC15' }]} />
            <View style={[styles.luzPequena, { backgroundColor: '#22C55E' }]} />
          </View>

          <Text style={styles.tituloBanner}>Pokédex Batalha</Text>
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
                <View style={styles.badgeTipo}>
                  <Text style={styles.textoTipo}>
                    {primeiraLetraMaiuscula(pokemon.tipo)}
                  </Text>
                </View>
              </View>

              <Image
                source={{ uri: pokemon.imagem }}
                style={styles.imagemPokemon}
                resizeMode="contain"
              />

              <Text style={styles.nomePokemon}>
                {primeiraLetraMaiuscula(pokemon.nome)}
              </Text>

              <TouchableOpacity
                style={styles.botaoSortear}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={sortearPokemon}
              >
                <MaterialIcons name="refresh" size={18} color="#FFFFFF" />
  
                <Text style={styles.textoBotaoSortear}>Sortear outro Pokémon</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        <Text style={styles.tituloSecao}>Atalhos Rápidos</Text>

        <BotaoAtalho
          titulo="Abrir Pokédex"
          subtitulo="Consulte os Pokémon, tipos e detalhes"
          icone="catching-pokemon"
          corIcone="#DC0A2D"
          onPress={() => navigation.navigate('Pokedex')}
        />

        <BotaoAtalho
          titulo="Arena de Batalha"
          subtitulo="Escolha seus Pokémon e simule um combate"
          icone="flash-on"
          corIcone="#F59E0B"
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
    backgroundColor: '#DC0A2D',
    borderRadius: 16,
    padding: 18,
    marginBottom: 22,
  },
  linhaLuzes: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  lenteAzul: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#38BDF8',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginRight: 10,
  },
  luzPequena: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginRight: 6,
  },
  tituloBanner: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtituloBanner: {
    fontSize: 14,
    color: '#FEE2E2',
    marginTop: 6,
    lineHeight: 20,
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
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
  badgeTipo: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  textoTipo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#DC0A2D',
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
    marginBottom: 25,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  linhaAtributos: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  boxAtributo: {
    flex: 1,
    alignItems: 'center',
  },
  labelAtributo: {
    fontSize: 12,
    color: '#64748B',
  },
  valorAtributo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 2,
  },
  botaoSortear: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC0A2D',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  textoBotaoSortear: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});
