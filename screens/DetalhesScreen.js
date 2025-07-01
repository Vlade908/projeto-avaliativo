import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DetalhesScreen({ route }) {
  const { nomeGasto, valor, categoria, data } = route.params || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>📊 Detalhes do Gasto</Text>

        <View style={styles.card}>
          <View style={styles.item}>
            <Ionicons name="document-text-outline" size={22} color="#4B7BEC" />
            <View style={styles.textGroup}>
              <Text style={styles.label}>Nome</Text>
              <Text style={styles.valor}>{nomeGasto}</Text>
            </View>
          </View>
          <View style={styles.divisor} />

          <View style={styles.item}>
            <Ionicons name="cash-outline" size={22} color="#4B7BEC" />
            <View style={styles.textGroup}>
              <Text style={styles.label}>Valor</Text>
              <Text style={styles.valor}>R$ {valor}</Text>
            </View>
          </View>
          <View style={styles.divisor} />

          <View style={styles.item}>
            <Ionicons name="pricetags-outline" size={22} color="#4B7BEC" />
            <View style={styles.textGroup}>
              <Text style={styles.label}>Categoria</Text>
              <Text style={styles.valor}>{categoria}</Text>
            </View>
          </View>
          <View style={styles.divisor} />

          <View style={styles.item}>
            <Ionicons name="calendar-outline" size={22} color="#4B7BEC" />
            <View style={styles.textGroup}>
              <Text style={styles.label}>Data</Text>
              <Text style={styles.valor}>{data}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e4edff', // Azul bem claro
  },
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2d3e50',
    marginBottom: 28,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderWidth: 0.5,
    borderColor: '#dbe2ef',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  textGroup: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#7a8ca3',
    marginBottom: 4,
  },
  valor: {
    fontSize: 18,
    color: '#2f3542',
    fontWeight: '600',
  },
  divisor: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 6,
  },
});
