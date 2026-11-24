import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function SobreScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.card}>
        <MaterialIcons name="info-outline" size={48} color="#DC0A2D" />
        <Text style={styles.titulo}>Sobre o App</Text>
        <Text style={styles.descricao}>
          Esta tela será construída na próxima etapa do projeto.
        </Text>

        <TouchableOpacity
          style={styles.botao}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Inicio')}
        >
          <Text style={styles.textoBotao}>Voltar para o Início</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 12,
  },
  descricao: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
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
