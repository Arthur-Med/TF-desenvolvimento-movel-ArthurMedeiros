import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardPokemon from '../components/CardPokemon';
import { CORES_TIPOS } from '../coresTipos';

const LIMITE_PAGINA = 20;
const TOTAL_GEN1 = 151;

const TIPOS = [
  { id: 'todos', nome: 'Todos' },
  { id: 'fire', nome: 'Fogo' },
  { id: 'water', nome: 'Água' },
  { id: 'grass', nome: 'Planta' },
  { id: 'electric', nome: 'Elétrico' },
  { id: 'psychic', nome: 'Psíquico' },
  { id: 'normal', nome: 'Normal' },
  { id: 'poison', nome: 'Veneno' },
  { id: 'bug', nome: 'Inseto' },
  { id: 'ground', nome: 'Terra' },
  { id: 'rock', nome: 'Pedra' },
  { id: 'fighting', nome: 'Lutador' },
  { id: 'flying', nome: 'Voador' },
  { id: 'ice', nome: 'Gelo' },
  { id: 'ghost', nome: 'Fantasma' },
  { id: 'dragon', nome: 'Dragão' },
  { id: 'fairy', nome: 'Fada' },
  { id: 'steel', nome: 'Aço' },
];

function pegarId(url) {
  const partes = url.split('/');
  return Number(partes[partes.length - 2]);
}

function pegarImagem(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export default function PokedexScreen({ navigation }) {
  const [pokemons, setPokemons] = useState([]);
  const [todosGen1, setTodosGen1] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [busca, setBusca] = useState('');
  const [tipo, setTipo] = useState('todos');

  // Carrega os Pokemon de 20 em 20 
  const carregarPokemons = (novoOffset) => {
    const restantes = TOTAL_GEN1 - novoOffset;
    if (restantes <= 0) return;

    const limite = restantes < LIMITE_PAGINA ? restantes : LIMITE_PAGINA;

    if (novoOffset === 0) {
      setIsLoading(true);
      setError(null);
    } else {
      setCarregandoMais(true);
    }

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limite}&offset=${novoOffset}`)
      .then((res) => res.json())
      .then((dados) => {
        const novos = dados.results.map((item) => {
          const id = pegarId(item.url);
          return { id, nome: item.name, imagem: pegarImagem(id) };
        });

        if (novoOffset === 0) {
          setPokemons(novos);
        } else {
          setPokemons((anteriores) => [
            ...anteriores,
            ...novos.filter((n) => !anteriores.some((a) => a.id === n.id)),
          ]);
        }
        setOffset(novoOffset + limite);
      })
      .catch(() => setError('Não foi possível carregar a Pokédex.'))
      .finally(() => {
        setIsLoading(false);
        setCarregandoMais(false);
      });
  };

  useEffect(() => {
    carregarPokemons(0);

    // Apenas gen1
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_GEN1}`)
      .then((res) => res.json())
      .then((dados) => {
        const lista = dados.results.map((item) => {
          const id = pegarId(item.url);
          return { id, nome: item.name, imagem: pegarImagem(id) };
        });
        setTodosGen1(lista);
      })
      .catch(() => {});
  }, []);

  // infinite scroll
  const carregarMais = () => {
    if (
      isLoading ||
      carregandoMais ||
      tipo !== 'todos' ||
      busca !== '' ||
      offset >= TOTAL_GEN1
    ) {
      return;
    }
    carregarPokemons(offset);
  };

  // Filtro por tipo 
  const filtrarPorTipo = (idTipo) => {
    setTipo(idTipo);
    setBusca('');
    setError(null);

    if (idTipo === 'todos') {
      carregarPokemons(0);
      return;
    }

    setIsLoading(true);
    fetch(`https://pokeapi.co/api/v2/type/${idTipo}`)
      .then((res) => res.json())
      .then((dados) => {
        const lista = dados.pokemon
          .map((item) => {
            const id = pegarId(item.pokemon.url);
            return { id, nome: item.pokemon.name, imagem: pegarImagem(id) };
          })
          .filter((p) => p.id <= TOTAL_GEN1);

        setPokemons(lista);
      })
      .catch(() => setError('Erro ao filtrar por tipo.'))
      .finally(() => setIsLoading(false));
  };

  // live search
  const termo = busca.trim().toLowerCase().replace('#', '');
  const baseLista =
    tipo === 'todos' && termo !== '' && todosGen1.length > 0 ? todosGen1 : pokemons;
  const listaExibida = baseLista.filter(
    (p) => p.nome.includes(termo) || String(p.id).includes(termo)
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.topo}>
        <TextInput
          style={styles.input}
          value={busca}
          onChangeText={setBusca}
          placeholder="Buscar por nome ou número do pokemon"
          autoCapitalize="none"
        />

        <FlatList
          data={TIPOS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listaTipos}
          renderItem={({ item }) => {
            const ativo = tipo === item.id;
            const corAtiva = CORES_TIPOS[item.id] || '#DC0A2D';
            return (
              <TouchableOpacity
                style={[
                  styles.botaoTipo,
                  ativo && { backgroundColor: corAtiva, borderColor: corAtiva },
                ]}
                onPress={() => filtrarPorTipo(item.id)}
              >
                <Text style={[styles.textoTipo, ativo && styles.textoTipoAtivo]}>
                  {item.nome}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {isLoading ? (
        <View style={styles.centralizado}>
          <ActivityIndicator size="large" color="#DC0A2D" />
          <Text style={styles.mensagem}>Carregando Pokédex...</Text>
        </View>
      ) : error ? (
        <View style={styles.centralizado}>
          <Text style={styles.textoErro}>{error}</Text>
          <TouchableOpacity style={styles.botaoTentar} onPress={() => carregarPokemons(0)}>
            <Text style={styles.textoBotao}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={listaExibida}
          numColumns={2}
          keyExtractor={(item) => String(item.id)}
          columnWrapperStyle={styles.linhaGrid}
          contentContainerStyle={styles.grid}
          onEndReached={carregarMais}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            carregandoMais ? <ActivityIndicator style={{ margin: 16 }} color="#DC0A2D" /> : null
          }
          ListEmptyComponent={
            <Text style={styles.mensagem}>Nenhum Pokémon encontrado.</Text>
          }
          renderItem={({ item }) => (
            <CardPokemon
              pokemon={item}
              onPress={() => navigation.navigate('Detalhes', { id: item.id, nome: item.nome })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  topo: {
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    marginHorizontal: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  listaTipos: {
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  botaoTipo: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginRight: 8,
  },
  botaoTipoAtivo: {
    backgroundColor: '#DC0A2D',
    borderColor: '#DC0A2D',
  },
  textoTipo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#334155',
  },
  textoTipoAtivo: {
    color: '#FFFFFF',
  },
  grid: {
    padding: 14,
  },
  linhaGrid: {
    justifyContent: 'space-between',
  },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mensagem: {
    marginTop: 10,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  textoErro: {
    marginBottom: 14,
    fontSize: 14,
    color: '#DC0A2D',
    textAlign: 'center',
  },
  botaoTentar: {
    backgroundColor: '#DC0A2D',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
