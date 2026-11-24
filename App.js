import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import InicioScreen from './src/screens/InicioScreen';
import PokedexScreen from './src/screens/PokedexScreen';
import BatalhaScreen from './src/screens/BatalhaScreen';
import SobreScreen from './src/screens/SobreScreen';
import DetalhesScreen from './src/screens/DetalhesScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();


function MenuDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#DC0A2D' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold' },
        drawerType: 'front',
        drawerStyle: { width: 270, backgroundColor: '#1B1B1B' },
        drawerActiveTintColor: '#FACC15',
        drawerInactiveTintColor: '#E2E8F0',
      }}
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
        name="Batalha"
        component={BatalhaScreen}
        options={{
          title: 'Arena de Batalha',
          drawerLabel: 'Arena de Batalha',
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
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="MenuPrincipal"
              component={MenuDrawer}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Detalhes"
              component={DetalhesScreen}
              options={{
                title: 'Detalhes do Pokémon',
                headerStyle: { backgroundColor: '#DC0A2D' },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: { fontWeight: 'bold' },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
