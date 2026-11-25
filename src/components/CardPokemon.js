import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CORES_TIPOS } from '../coresTipos';

const cacheTipos = {};

function primeiraLetraMaiuscula(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export default function CardPokemon(props) {
  const { pokemon, onPress, style } = props;
  const [tipos, setTipos] = useState(cacheTipos[pokemon.id] || []);

  useEffect(() => {
    if (cacheTipos[pokemon.id]) {
      setTipos(cacheTipos[pokemon.id]);
      return;
    }

    let ativo = true;
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`)
      .then((res) => res.json())
      .then((dados) => {
        const listaTipos = dados.types.map((t) => t.type.name);
        cacheTipos[pokemon.id] = listaTipos;
        if (ativo) setTipos(listaTipos);
      })
      .catch(() => {});

    return () => {
      ativo = false;
    };
  }, [pokemon.id]);

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.topoCard}>
        <Text style={styles.numero}>
          #{String(pokemon.id).padStart(3, '0')}
        </Text>

        <View style={styles.listaTipos}>
          {tipos.map((t) => (
            <View
              key={t}
              style={[
                styles.badgeTipo,
                { backgroundColor: CORES_TIPOS[t] || '#64748B' },
              ]}
            >
              <Text style={styles.textoTipo}>{primeiraLetraMaiuscula(t)}</Text>
            </View>
          ))}
        </View>
      </View>

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
  topoCard: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  numero: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
  },
  listaTipos: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 4,
    marginLeft: 4,
  },
  badgeTipo: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  textoTipo: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
