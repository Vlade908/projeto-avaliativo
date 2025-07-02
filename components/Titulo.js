// components/Titulo.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Titulo({ children }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.titulo}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingTop: 50, // espaço para status bar
    paddingBottom: 20,
    backgroundColor: '#4B7BEC',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    zIndex: 10,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
});
