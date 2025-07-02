// App.js
import 'react-native-reanimated';
import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import CadastroScreen from './screens/CadastroScreen';
import ListaScreen from './screens/ListaScreen';
import PerfilScreen from './screens/PerfilScreen';
import DetalhesScreen from './screens/DetalhesScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs({ gastos, adicionarGasto, limparGastos, removerGasto }) {
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
          <ListaScreen
            {...props}
            gastos={gastos}
            limparGastos={limparGastos}
            removerGasto={removerGasto}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [gastos, setGastos] = useState([]);

  // ATENÇÃO: essa linha limpa gastos antigos na primeira execução para evitar erros de ID duplicado.
  /*useEffect(() => {
    async function limparStorage() {
      //await AsyncStorage.removeItem('@gastos'); // LIMPEZA TEMPORÁRIA: COMENTE DEPOIS DA PRIMEIRA RODADA
    }
    limparStorage();
  }, []);
  */

  useEffect(() => {
    async function carregarGastos() {
      try {
        const dados = await AsyncStorage.getItem('@gastos');
        if (dados !== null) {
          setGastos(JSON.parse(dados));
        }
      } catch (error) {
        console.log('Erro ao carregar gastos:', error);
      }
    }
    carregarGastos();
  }, []);

  useEffect(() => {
    async function salvarGastos() {
      try {
        await AsyncStorage.setItem('@gastos', JSON.stringify(gastos));
      } catch (error) {
        console.log('Erro ao salvar gastos:', error);
      }
    }
    salvarGastos();
  }, [gastos]);

  const adicionarGasto = (gasto) => {
    setGastos((prev) => [...prev, { ...gasto, id: String(Date.now()) }]);
  };

  const limparGastos = () => {
    setGastos([]);
  };

  const removerGasto = (id) => {
    setGastos((prev) => prev.filter((gasto) => gasto.id !== id));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" options={{ headerShown: false }}>
              {(props) => (
                <Tabs
                  {...props}
                  gastos={gastos}
                  adicionarGasto={adicionarGasto}
                  limparGastos={limparGastos}
                  removerGasto={removerGasto}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Detalhes" component={DetalhesScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
