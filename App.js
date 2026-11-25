import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';

import InicioScreen from './src/screens/InicioScreen';
import PokedexScreen from './src/screens/PokedexScreen';
import FavoritosScreen from './src/screens/FavoritosScreen';
import BatalhaScreen from './src/screens/BatalhaScreen';
import SobreScreen from './src/screens/SobreScreen';
import DetalhesScreen from './src/screens/DetalhesScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <NavigationContainer>
          <Drawer.Navigator
            initialRouteName="Inicio"
            screenOptions={({ navigation }) => ({
              headerShown: true,
              headerStyle: { backgroundColor: '#DC0A2D' },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: { fontWeight: 'bold' },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.toggleDrawer()}
                  style={{ marginLeft: 16 }}
                >
                  <MaterialIcons name="menu" size={28} color="#FFFFFF" />
                </TouchableOpacity>
              ),
              drawerType: 'front',
              drawerStyle: { width: 270, backgroundColor: '#1B1B1B' },
              drawerActiveTintColor: '#FACC15',
              drawerInactiveTintColor: '#E2E8F0',
              drawerContentContainerStyle: { paddingStart: 0, paddingEnd: 0 },
              drawerItemStyle: { borderRadius: 0, marginHorizontal: 0 },
            })}
          >
            <Drawer.Screen
              name="Inicio"
              component={InicioScreen}
              options={{
                title: 'Início',
                drawerLabel: 'Início',
              }}
            />

            <Drawer.Screen
              name="Pokedex"
              component={PokedexScreen}
              options={{
                title: 'Pokédex',
                drawerLabel: 'Pokédex',
              }}
            />

            <Drawer.Screen
              name="Favoritos"
              component={FavoritosScreen}
              options={{
                title: 'Favoritos',
                drawerLabel: 'Favoritos',
              }}
            />

            <Drawer.Screen
              name="Batalha"
              component={BatalhaScreen}
              options={{
                title: 'Batalhar',
                drawerLabel: 'Batalhar',
              }}
            />

            <Drawer.Screen
              name="Sobre"
              component={SobreScreen}
              options={{
                title: 'Sobre o App',
                drawerLabel: 'Sobre o App',
              }}
            />

            <Drawer.Screen
              name="Detalhes"
              component={DetalhesScreen}
              options={{
                title: 'Detalhes do Pokémon',
                drawerItemStyle: { display: 'none' },
              }}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
