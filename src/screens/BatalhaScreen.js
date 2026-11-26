import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CORES_TIPOS } from '../coresTipos';

function formatar(texto) {
  const limpo = texto.replace(/-/g, ' ');
  return limpo.charAt(0).toUpperCase() + limpo.slice(1);
}

function corHp(hp, hpMax) {
  const pct = hp / hpMax;
  if (pct > 0.5) return '#22C55E';
  if (pct > 0.2) return '#EAB308';
  return '#EF4444';
}

async function carregarLutador(id) {
  const dados = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((r) => r.json());

  const sorteados = [...dados.moves].sort(() => Math.random() - 0.5).slice(0, 4);
  const golpes = await Promise.all(
    sorteados.map((m) =>
      fetch(m.move.url)
        .then((r) => r.json())
        .then((g) => ({ nome: g.name, tipo: g.type.name }))
    )
  );

  const tipos = await Promise.all(
    dados.types.map((t) => fetch(t.type.url).then((r) => r.json()))
  );

  const hpMax = dados.stats[0].base_stat + 60;
  return {
    id: dados.id,
    nome: dados.name,
    spriteFrente: dados.sprites.front_default,
    spriteCostas: dados.sprites.back_default || dados.sprites.front_default,
    hp: hpMax,
    hpMax,
    ataque: dados.stats[1].base_stat,
    defesa: dados.stats[2].base_stat,
    golpes,
    fraquezas: tipos.flatMap((t) => t.damage_relations.double_damage_from.map((x) => x.name)),
    resistencias: tipos.flatMap((t) => t.damage_relations.half_damage_from.map((x) => x.name)),
    imunidades: tipos.flatMap((t) => t.damage_relations.no_damage_from.map((x) => x.name)),
  };
}

function calcularDano(atacante, defensor, tipoGolpe) {
  if (defensor.imunidades.includes(tipoGolpe)) {
    return { dano: 0, aviso: ' Não teve efeito!' };
  }

  let mult = 1;
  defensor.fraquezas.forEach((f) => { if (f === tipoGolpe) mult *= 2; });
  defensor.resistencias.forEach((r) => { if (r === tipoGolpe) mult *= 0.5; });

  const base = Math.round((atacante.ataque / defensor.defesa) * 28);
  const variacao = Math.floor(Math.random() * 11) - 5;
  const dano = Math.max(5, Math.round((base + variacao) * mult));

  const aviso =
    mult > 1 ? ' É super efetivo!' : mult < 1 ? ' Não é muito efetivo...' : '';
  return { dano, aviso };
}

function HudPokemon({ pokemon, estilo, mostrarHp }) {
  return (
    <View style={[styles.hud, estilo]}>
      <View style={styles.hudTopo}>
        <Text style={styles.hudNome} numberOfLines={1}>
          {formatar(pokemon.nome).toUpperCase()}
        </Text>
        <Text style={styles.hudNivel}>Lv50</Text>
      </View>

      <View style={styles.linhaHp}>
        <Text style={styles.labelHp}>HP</Text>
        <View style={styles.fundoBarra}>
          <View
            style={[
              styles.barraHp,
              {
                width: `${(pokemon.hp / pokemon.hpMax) * 100}%`,
                backgroundColor: corHp(pokemon.hp, pokemon.hpMax),
              },
            ]}
          />
        </View>
      </View>

      {mostrarHp ? (
        <Text style={styles.textoHp}>
          {pokemon.hp} / {pokemon.hpMax}
        </Text>
      ) : null}
    </View>
  );
}

export default function BatalhaScreen({ navigation }) {
  const [listaGen1, setListaGen1] = useState([]);
  const [busca, setBusca] = useState('');
  const [escolhendo, setEscolhendo] = useState(true);

  const [jogador, setJogador] = useState(null);
  const [inimigo, setInimigo] = useState(null);
  const [menuAcao, setMenuAcao] = useState('principal');
  const [pocoes, setPocoes] = useState(2);
  const [superPocoes, setSuperPocoes] = useState(1);
  const [mensagem, setMensagem] = useState('');
  const [vencedor, setVencedor] = useState(null);
  const [aguardando, setAguardando] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: escolhendo ? 'Escolha seu Pokémon' : 'Batalhar',
      headerTitleAlign: 'center',
    });
  }, [navigation, escolhendo]);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      .then((res) => res.json())
      .then((dados) => {
        const lista = dados.results.map((item, i) => ({
          id: i + 1,
          nome: item.name,
          imagem: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i + 1}.png`,
        }));
        setListaGen1(lista);
      });
  }, []);

  const iniciarBatalha = (idEscolhido) => {
    const idInimigo = Math.floor(Math.random() * 151) + 1;
    setBusca('');
    setMenuAcao('principal');
    setPocoes(2);
    setSuperPocoes(1);
    setVencedor(null);
    setAguardando(false);

    Promise.all([carregarLutador(idEscolhido), carregarLutador(idInimigo)]).then(
      ([pJogador, pInimigo]) => {
        setJogador(pJogador);
        setInimigo(pInimigo);
        setEscolhendo(false);
        setMensagem(
          `Um ${formatar(pInimigo.nome)} selvagem apareceu!\nO que ${formatar(pJogador.nome)} vai fazer?`
        );
      }
    );
  };

  const turnoInimigo = (jogAtual, iniAtual) => {
    setAguardando(true);

    setTimeout(() => {
      const golpe = iniAtual.golpes[Math.floor(Math.random() * iniAtual.golpes.length)];
      const { dano, aviso } = calcularDano(iniAtual, jogAtual, golpe.tipo);
      const novoHp = Math.max(0, jogAtual.hp - dano);

      setJogador({ ...jogAtual, hp: novoHp });
      setAguardando(false);

      const fim = novoHp === 0 ? '\nVocê perdeu!' : '';
      if (novoHp === 0) setVencedor('inimigo');
      setMensagem(
        `${formatar(iniAtual.nome)} usou ${formatar(golpe.nome)} (-${dano} HP)!${aviso}${fim}`
      );
    }, 1500);
  };

  const atacar = (golpe) => {
    const { dano, aviso } = calcularDano(jogador, inimigo, golpe.tipo);
    const novoHp = Math.max(0, inimigo.hp - dano);
    const iniAtual = { ...inimigo, hp: novoHp };

    setInimigo(iniAtual);
    setMenuAcao('principal');
    const texto = `${formatar(jogador.nome)} usou ${formatar(golpe.nome)} (-${dano} HP)!${aviso}`;

    if (novoHp === 0) {
      setVencedor('jogador');
      setMensagem(`${texto}\nVitória! ${formatar(inimigo.nome)} desmaiou!`);
      return;
    }

    setMensagem(texto);
    turnoInimigo(jogador, iniAtual);
  };

  const usarItem = (nome, cura) => {
    if (jogador.hp >= jogador.hpMax) {
      setMensagem('O HP já está cheio!');
      return;
    }

    if (nome === 'Poção') setPocoes(pocoes - 1);
    else setSuperPocoes(superPocoes - 1);

    const novoHp = Math.min(jogador.hpMax, jogador.hp + cura);
    const recuperado = novoHp - jogador.hp;
    const jogAtual = { ...jogador, hp: novoHp };

    setJogador(jogAtual);
    setMenuAcao('principal');
    setMensagem(`Você usou ${nome} (+${recuperado} HP)!`);
    turnoInimigo(jogAtual, inimigo);
  };

  const termo = busca.trim().toLowerCase().replace('#', '');
  const listaFiltrada = listaGen1.filter(
    (p) => p.nome.includes(termo) || String(p.id).includes(termo)
  );

  if (escolhendo || !jogador || !inimigo) {
    return (
      <SafeAreaView style={styles.safeAreaEscolha} edges={['bottom']}>
        <TextInput
          style={styles.input}
          value={busca}
          onChangeText={setBusca}
          placeholder="Buscar por nome ou número..."
          autoCapitalize="none"
        />

        <FlatList
          data={listaFiltrada}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 14 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.itemLista} onPress={() => iniciarBatalha(item.id)}>
              <Image source={{ uri: item.imagem }} style={styles.imagemLista} resizeMode="contain" />
              <Text style={styles.numeroLista}>#{String(item.id).padStart(3, '0')}</Text>
              <Text style={styles.nomeLista}>{formatar(item.nome)}</Text>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.fundobatalha}>
        <Image
          source={require('../../assets/fundobatalha.png')}
          style={styles.imagemFundo}
          resizeMode="stretch"
        />
        <HudPokemon pokemon={inimigo} estilo={styles.hudInimigo} />
        <Image source={{ uri: inimigo.spriteFrente }} style={styles.spriteInimigo} resizeMode="contain" />
        <Image source={{ uri: jogador.spriteCostas }} style={styles.spriteJogador} resizeMode="contain" />
        <HudPokemon pokemon={jogador} estilo={styles.hudJogador} mostrarHp />
      </View>

      <View style={styles.painelInferior}>
        <View style={styles.caixaDialogo}>
          <Text style={styles.textoDialogo}>{mensagem}</Text>
        </View>

        {vencedor ? (
          <TouchableOpacity style={styles.botaoNovaBatalha} onPress={() => setEscolhendo(true)}>
            <Text style={styles.textoBotaoBranco}>NOVA BATALHA</Text>
          </TouchableOpacity>
        ) : menuAcao === 'principal' ? (
          <View style={styles.linha}>
            <TouchableOpacity
              style={[
                styles.botaoMenu,
                { backgroundColor: '#DC2626' },
                aguardando && styles.desativado,
              ]}
              disabled={aguardando}
              onPress={() => setMenuAcao('ataques')}
            >
              <Text style={styles.textoBotaoBranco}>ATACAR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.botaoMenu,
                { backgroundColor: '#D97706' },
                aguardando && styles.desativado,
              ]}
              disabled={aguardando}
              onPress={() => setMenuAcao('itens')}
            >
              <Text style={styles.textoBotaoBranco}>ITEM</Text>
            </TouchableOpacity>
          </View>
        ) : menuAcao === 'ataques' ? (
          <View>
            <View style={styles.gradeGolpes}>
              {jogador.golpes.map((golpe) => (
                <TouchableOpacity
                  key={golpe.nome}
                  style={[styles.botaoGolpe, { borderColor: CORES_TIPOS[golpe.tipo] || '#475569' }]}
                  onPress={() => atacar(golpe)}
                >
                  <Text style={styles.textoGolpe} numberOfLines={1}>{formatar(golpe.nome)}</Text>
                  <Text style={[styles.tipoGolpe, { color: CORES_TIPOS[golpe.tipo] || '#475569' }]}>
                    {formatar(golpe.tipo)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.botaoVoltar} onPress={() => setMenuAcao('principal')}>
              <Text style={styles.textoVoltar}>VOLTAR</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={styles.linha}>
              <TouchableOpacity
                style={[styles.botaoItem, pocoes === 0 && styles.desativado]}
                disabled={pocoes === 0}
                onPress={() => usarItem('Poção', 40)}
              >
                <Text style={styles.textoGolpe}>Poção (+40)</Text>
                <Text style={styles.qtdItem}>x{pocoes}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.botaoItem, superPocoes === 0 && styles.desativado]}
                disabled={superPocoes === 0}
                onPress={() => usarItem('Super Poção', 80)}
              >
                <Text style={styles.textoGolpe}>Super Poção (+80)</Text>
                <Text style={styles.qtdItem}>x{superPocoes}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.botaoVoltar} onPress={() => setMenuAcao('principal')}>
              <Text style={styles.textoVoltar}>VOLTAR</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1E293B' },
  safeAreaEscolha: { flex: 1, backgroundColor: '#F1F5F9' },
  fundobatalha: { flex: 1, width: '100%' },
  imagemFundo: { position: 'absolute', width: '100%', height: '100%' },
  hud: {
    position: 'absolute',
    width: '50%',
    backgroundColor: '#FEF9E7',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#334155',
    padding: 8,
  },
  hudInimigo: { top: 16, left: 12 },
  hudJogador: { bottom: 14, right: 12 },
  hudTopo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  hudNome: { flex: 1, fontSize: 13, fontWeight: 'bold', color: '#1E293B', marginRight: 4 },
  hudNivel: { fontSize: 12, fontWeight: 'bold', color: '#334155' },
  linhaHp: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#334155', borderRadius: 6, padding: 3 },
  labelHp: { fontSize: 10, fontWeight: 'bold', color: '#FACC15', marginHorizontal: 4 },
  fundoBarra: { flex: 1, height: 8, backgroundColor: '#475569', borderRadius: 4, overflow: 'hidden' },
  barraHp: { height: '100%', borderRadius: 4 },
  textoHp: { fontSize: 12, fontWeight: 'bold', color: '#1E293B', textAlign: 'right', marginTop: 4 },
  spriteInimigo: { position: 'absolute', right: '6%', bottom: '33%', width: 145, height: 145 },
  spriteJogador: { position: 'absolute', left: '4%', bottom: '6%', width: 165, height: 165 },
  painelInferior: { backgroundColor: '#1E293B', borderTopWidth: 4, borderTopColor: '#0F172A', padding: 12, gap: 10 },
  caixaDialogo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#475569',
    padding: 12,
    minHeight: 68,
    justifyContent: 'center',
  },
  textoDialogo: { fontSize: 14, fontWeight: '600', color: '#1E293B', lineHeight: 20 },
  linha: { flexDirection: 'row', gap: 10 },
  botaoMenu: { flex: 1, paddingVertical: 16, borderRadius: 10, borderWidth: 3, borderColor: '#0F172A', alignItems: 'center' },
  botaoNovaBatalha: {
    backgroundColor: '#DC0A2D',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#0F172A',
    alignItems: 'center',
  },
  textoBotaoBranco: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  gradeGolpes: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  botaoGolpe: {
    width: '48%',
    backgroundColor: '#FEF9E7',
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  botaoItem: {
    flex: 1,
    backgroundColor: '#FEF9E7',
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#475569',
    alignItems: 'center',
  },
  desativado: { opacity: 0.4 },
  textoGolpe: { fontSize: 14, fontWeight: 'bold', color: '#1E293B' },
  tipoGolpe: { fontSize: 11, fontWeight: 'bold', marginTop: 2 },
  qtdItem: { fontSize: 12, fontWeight: 'bold', color: '#475569', marginTop: 2 },
  botaoVoltar: { marginTop: 8, paddingVertical: 6, alignItems: 'center' },
  textoVoltar: { fontSize: 13, fontWeight: 'bold', color: '#CBD5E1' },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    margin: 14,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  itemLista: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  imagemLista: { width: 52, height: 52, marginRight: 10 },
  numeroLista: { fontSize: 13, fontWeight: 'bold', color: '#64748B', marginRight: 10 },
  nomeLista: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
});
