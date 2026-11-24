import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';

import InicioScreen from './src/screens/InicioScreen';
import PokedexScreen from './src/screens/PokedexScreen';
import BatalhaScreen from './src/screens/BatalhaScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    // Regra hierárquica: SafeAreaProvider envolve toda a raiz do aplicativo
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <NavigationContainer>
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
                drawerIcon: ({ color, size }) => (
                  <MaterialIcons name="home" size={size} color={color} />
                ),
              }}
            />

            <Drawer.Screen
              name="Pokedex"
              component={PokedexScreen}
              options={{
                title: 'Pokédex',
                drawerLabel: 'Pokédex',
                drawerIcon: ({ color, size }) => (
                  <MaterialIcons name="catching-pokemon" size={size} color={color} />
                ),
              }}
            />

            <Drawer.Screen
              name="Batalha"
              component={BatalhaScreen}
              options={{
                title: 'Arena de Batalha',
                drawerLabel: 'Arena de Batalha',
                drawerIcon: ({ color, size }) => (
                  <MaterialIcons name="flash-on" size={size} color={color} />
                ),
              }}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
