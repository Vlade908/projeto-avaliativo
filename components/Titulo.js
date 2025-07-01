import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Componente simples para título padrão no topo
export default function Titulo({ texto }) {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4B7BEC',
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2c5bbf',
  },
  texto: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
