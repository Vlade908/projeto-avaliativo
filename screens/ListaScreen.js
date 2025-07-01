import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import GastoItem from '../components/GastoItem';

export default function ListaScreen({ gastos, limparGastos }) {
  const renderizaItem = ({ item }) => {
    return <GastoItem gasto={item} />;
  };

  const renderizaListaVazia = () => (
    <View style={styles.listaVazia}>
      <Text style={styles.textoListaVazia}>Nenhum gasto cadastrado.</Text>
    </View>
  );

  const confirmarLimpar = () => {
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja limpar todos os gastos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sim', onPress: limparGastos },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header com estilo moderno */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Lista de Gastos</Text>
        </View>

        <FlatList
          data={gastos}
          keyExtractor={(item) => item.id}
          renderItem={renderizaItem}
          ListEmptyComponent={renderizaListaVazia}
          contentContainerStyle={gastos.length === 0 ? styles.flatListVazia : null}
        />

        {/* Botão flutuante no canto inferior direito */}
        <TouchableOpacity style={styles.botaoFlutuante} onPress={confirmarLimpar}>
          <Text style={styles.textoBotao}>Limpar Tudo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 24,
    backgroundColor: '#4B7BEC',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  listaVazia: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textoListaVazia: {
    fontSize: 18,
    color: '#888',
  },
  flatListVazia: {
    flexGrow: 1,
  },
  botaoFlutuante: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#d9534f',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
