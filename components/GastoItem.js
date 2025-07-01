import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GastoItem({ gasto }) {
  return (
    <View style={styles.card}>
      <Text style={styles.nome}>{gasto.nomeGasto || gasto.nome}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.valor}>R$ {gasto.valor}</Text>
        <Text style={styles.categoria}>{gasto.categoria}</Text>
        <Text style={styles.data}>{gasto.data}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 12,

    // sombra Android
    elevation: 5,

    // sombra iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  nome: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  valor: {
    fontSize: 16,
    color: '#4B7BEC',
    fontWeight: '600',
  },
  categoria: {
    fontSize: 16,
    color: '#666',
  },
  data: {
    fontSize: 14,
    color: '#999',
  },
});
