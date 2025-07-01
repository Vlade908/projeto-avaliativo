import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import CadastroScreen from './screens/CadastroScreen';
import ListaScreen from './screens/ListaScreen';
import PerfilScreen from './screens/PerfilScreen';
import DetalhesScreen from './screens/DetalhesScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs({ gastos, adicionarGasto, limparGastos }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4B7BEC',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { backgroundColor: '#fff', height: 60, paddingBottom: 5 },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Cadastro') iconName = 'add-circle-outline';
          else if (route.name === 'Lista') iconName = 'list-outline';
          else if (route.name === 'Perfil') iconName = 'person-circle-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Cadastro">
        {(props) => <CadastroScreen {...props} adicionarGasto={adicionarGasto} />}
      </Tab.Screen>
      <Tab.Screen name="Lista">
        {(props) => (
          <ListaScreen {...props} gastos={gastos} limparGastos={limparGastos} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [gastos, setGastos] = useState([]);

  const adicionarGasto = (gasto) => {
    setGastos((prev) => [...prev, { ...gasto, id: String(prev.length + 1) }]);
  };

  const limparGastos = () => {
    setGastos([]);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            options={{ headerShown: false }}
          >
            {(props) => (
              <Tabs
                {...props}
                gastos={gastos}
                adicionarGasto={adicionarGasto}
                limparGastos={limparGastos}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Detalhes" component={DetalhesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#4B7BEC',
  },
});
