import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Componente customizado de botão de atalho reutilizável
export default function BotaoAtalho(props) {
  return (
    // Composição de estilos em array: junta o estilo padrão com qualquer estilo extra do pai
    <TouchableOpacity
      style={[styles.botao, props.style]}
      activeOpacity={0.7}
      onPress={props.onPress}
    >
      <View style={[styles.caixaIcone, { backgroundColor: props.corIcone || '#DC0A2D' }]}>
        <MaterialIcons name={props.icone} size={26} color="#FFFFFF" />
      </View>

      <View style={styles.areaTexto}>
        <Text style={styles.titulo}>{props.titulo}</Text>
        <Text style={styles.subtitulo}>{props.subtitulo}</Text>
      </View>

      <MaterialIcons name="chevron-right" size={24} color="#94A3B8" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  caixaIcone: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  areaTexto: {
    flex: 1,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  subtitulo: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
});
