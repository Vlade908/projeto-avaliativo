import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function CadastroScreen({ navigation, adicionarGasto }) {
  const [nomeGasto, setNomeGasto] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [data, setData] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const enviarDados = () => {
    if (!nomeGasto || !valor || !categoria || !data) {
      alert('Preencha todos os campos');
      return;
    }
    const gasto = { nomeGasto, valor, categoria, data };
    adicionarGasto(gasto);
    navigation.navigate('Detalhes', gasto);

    // Limpa os inputs após salvar
    setNomeGasto('');
    setValor('');
    setCategoria('');
    setData('');
  };

  const abrirDatePicker = () => setShowDatePicker(true);

  const aoSelecionarData = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const dia = String(selectedDate.getDate()).padStart(2, '0');
      const mes = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const ano = selectedDate.getFullYear();
      setData(`${dia}/${mes}/${ano}`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Header moderno */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Cadastro de Gasto</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              placeholder="Nome do gasto"
              value={nomeGasto}
              onChangeText={setNomeGasto}
              style={styles.input}
              placeholderTextColor="#888"
            />
            <TextInput
              placeholder="Valor"
              value={valor}
              onChangeText={setValor}
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor="#888"
            />

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={categoria}
                onValueChange={(itemValue) => setCategoria(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecione a categoria" value="" />
                <Picker.Item label="Alimentação" value="Alimentação" />
                <Picker.Item label="Transporte" value="Transporte" />
                <Picker.Item label="Lazer" value="Lazer" />
                <Picker.Item label="Educação" value="Educação" />
                <Picker.Item label="Outros" value="Outros" />
              </Picker>
            </View>

            <TouchableOpacity onPress={abrirDatePicker} style={styles.input}>
              <Text style={{ color: data ? '#000' : '#888' }}>
                {data || 'Selecione a data'}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={aoSelecionarData}
              />
            )}

            <TouchableOpacity style={styles.botao} onPress={enviarDados}>
              <Text style={styles.textoBotao}>Salvar Gasto</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  scroll: {
    flexGrow: 1,
  },
  header: {
    padding: 24,
    backgroundColor: '#4B7BEC',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 1,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 14,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  botao: {
    backgroundColor: '#4B7BEC',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
