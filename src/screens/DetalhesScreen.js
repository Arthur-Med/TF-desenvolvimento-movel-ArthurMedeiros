import { useEffect, useState } from 'react';
import {
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
import { CORES_TIPOS } from '../coresTipos';

const CHAVE_FAVORITOS = 'pokemons_favoritos';

const NOMES_STATUS = {
  hp: 'HP',
  attack: 'Atk',
  defense: 'Def',
  'special-attack': 'SpA',
  'special-defense': 'SpD',
  speed: 'Spe',
};

function formatar(texto) {
  const limpo = texto.replace(/-/g, ' ');
  return limpo.charAt(0).toUpperCase() + limpo.slice(1);
}

function pegarEvolucoes(no, lista = []) {
  const partes = no.species.url.split('/');
  const id = Number(partes[partes.length - 2]);

  if (id <= 151) {
    lista.push({
      id,
      nome: no.species.name,
      imagem: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    });
  }

  no.evolves_to.forEach((proximo) => pegarEvolucoes(proximo, lista));
  return lista;
}

export default function DetalhesScreen({ route, navigation }) {
  const identificador = route.params?.id || route.params?.nome;

  const [pokemon, setPokemon] = useState(null);
  const [evolucoes, setEvolucoes] = useState([]);
  const [favorito, setFavorito] = useState(false);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${identificador}`)
      .then((res) => res.json())
      .then((dados) => {
        setPokemon(dados);

        AsyncStorage.getItem(CHAVE_FAVORITOS).then((salvos) => {
          const lista = salvos ? JSON.parse(salvos) : [];
          setFavorito(lista.some((item) => item.id === dados.id));
        });

        fetch(dados.species.url)
          .then((res) => res.json())
          .then((especie) => fetch(especie.evolution_chain.url))
          .then((res) => res.json())
          .then((cadeia) => setEvolucoes(pegarEvolucoes(cadeia.chain)));
      });
  }, [identificador]);

  const alternarFavorito = async () => {
    const novoValor = !favorito;
    setFavorito(novoValor);

    const salvos = await AsyncStorage.getItem(CHAVE_FAVORITOS);
    const lista = salvos ? JSON.parse(salvos) : [];
    const semAtual = lista.filter((item) => item.id !== pokemon.id);

    if (novoValor) {
      const novo = {
        id: pokemon.id,
        nome: pokemon.name,
        imagem: pokemon.sprites.other['official-artwork'].front_default,
      };
      await AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify([...semAtual, novo]));
    } else {
      await AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(semAtual));
    }
  };

  if (!pokemon) return null;

  const imagem = pokemon.sprites.other['official-artwork'].front_default;
  const corPrincipal = CORES_TIPOS[pokemon.types[0].type.name] || '#DC0A2D';
  const golpes = pokemon.moves
    .filter((m) =>
      m.version_group_details.some((v) => v.version_group.name === 'red-blue')
    )
    .map((m) => m.move.name);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.topoCard}>
            <Text style={styles.numero}>
              #{String(pokemon.id).padStart(3, '0')}
            </Text>

            <View style={styles.listaTipos}>
              {pokemon.types.map((t) => (
                <View
                  key={t.type.name}
                  style={[
                    styles.badgeTipo,
                    { backgroundColor: CORES_TIPOS[t.type.name] || '#64748B' },
                  ]}
                >
                  <Text style={styles.textoTipo}>{formatar(t.type.name)}</Text>
                </View>
              ))}
            </View>
          </View>

          <Image source={{ uri: imagem }} style={styles.imagem} resizeMode="contain" />
          <Text style={styles.nome}>{formatar(pokemon.name)}</Text>

          <TouchableOpacity
            style={styles.botaoFavorito}
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

        <View style={styles.card}>
          <Text style={styles.tituloSecao}>Status Base</Text>

          {pokemon.stats.map((s) => {
            const largura = Math.min((s.base_stat / 200) * 100, 100);
            return (
              <View key={s.stat.name} style={styles.linhaStatus}>
                <Text style={styles.nomeStatus}>{NOMES_STATUS[s.stat.name]}</Text>
                <Text style={styles.valorStatus}>{s.base_stat}</Text>
                <View style={styles.fundoBarra}>
                  <View
                    style={[
                      styles.barra,
                      { width: `${largura}%`, backgroundColor: corPrincipal },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.card}>
          <Text style={styles.tituloSecao}>Cadeia Evolutiva</Text>

          {evolucoes.length <= 1 ? (
            <Text style={styles.textoCinza}>Não possui evoluções na 1ª geração.</Text>
          ) : (
            <View style={styles.listaEvolucoes}>
              {evolucoes.map((evo) => (
                <TouchableOpacity
                  key={evo.id}
                  style={[
                    styles.cardEvolucao,
                    evo.id === pokemon.id && { borderColor: corPrincipal },
                  ]}
                  onPress={() =>
                    navigation.navigate('Detalhes', { id: evo.id, nome: evo.nome })
                  }
                >
                  <Image
                    source={{ uri: evo.imagem }}
                    style={styles.imagemEvolucao}
                    resizeMode="contain"
                  />
                  <Text style={styles.nomeEvolucao}>{formatar(evo.nome)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.tituloSecao}>Golpes ({golpes.length})</Text>

          <View style={styles.listaGolpes}>
            {golpes.map((golpe) => (
              <View key={golpe} style={styles.chipGolpe}>
                <Text style={styles.textoGolpe}>{formatar(golpe)}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F1F5F9' },
  container: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  numero: { fontSize: 16, fontWeight: 'bold', color: '#64748B' },
  listaTipos: { flexDirection: 'row', gap: 6 },
  badgeTipo: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20 },
  textoTipo: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' },
  imagem: { width: 180, height: 180, alignSelf: 'center', marginVertical: 8 },
  nome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
  },
  botaoFavorito: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  tituloSecao: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  linhaStatus: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  nomeStatus: { width: 36, fontSize: 13, fontWeight: 'bold', color: '#64748B' },
  valorStatus: {
    width: 34,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'right',
    marginRight: 10,
  },
  fundoBarra: {
    flex: 1,
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barra: { height: '100%', borderRadius: 5 },
  listaEvolucoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  cardEvolucao: {
    width: 96,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  imagemEvolucao: { width: 64, height: 64 },
  nomeEvolucao: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 4,
    textAlign: 'center',
  },
  textoCinza: { fontSize: 14, color: '#64748B', textAlign: 'center' },
  listaGolpes: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chipGolpe: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  textoGolpe: { fontSize: 13, color: '#334155', fontWeight: '600' },
});
