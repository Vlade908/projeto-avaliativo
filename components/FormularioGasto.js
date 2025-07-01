import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

// Componente do formulário para cadastrar gasto
export default function FormGasto({ onSubmit }) {
  // Estados para os campos do formulário
  const [nomeGasto, setNomeGasto] = useState('');
  const [valorGasto, setValorGasto] = useState('');
  const [categoriaGasto, setCategoriaGasto] = useState('');
  const [dataGasto, setDataGasto] = useState('');

  // Função para validar campos antes de enviar
  const validarCampos = () => {
    // Variáveis para controle de erros
    let erro = false;
    let mensagemErro = '';

    // Verifica nome do gasto
    if (nomeGasto.trim() === '') {
      erro = true;
      mensagemErro = 'Por favor, insira o nome do gasto.';
    }

    // Verifica valor (precisa ser número maior que zero)
    if (!erro && (valorGasto.trim() === '' || isNaN(Number(valorGasto)))) {
      erro = true;
      mensagemErro = 'Por favor, insira um valor numérico válido.';
    } else if (!erro && Number(valorGasto) <= 0) {
      erro = true;
      mensagemErro = 'O valor do gasto deve ser maior que zero.';
    }

    // Verifica categoria (não pode estar vazia)
    if (!erro && categoriaGasto.trim() === '') {
      erro = true;
      mensagemErro = 'Por favor, informe a categoria do gasto.';
    }

    // Verifica data (não pode estar vazia, pode melhorar depois com validação)
    if (!erro && dataGasto.trim() === '') {
      erro = true;
      mensagemErro = 'Por favor, informe a data do gasto.';
    }

    // Se houver erro, mostra alerta e retorna falso
    if (erro) {
      Alert.alert('Erro', mensagemErro);
      return false;
    }

    // Se passou por todas validações retorna true
    return true;
  };

  // Função executada ao submeter o formulário
  const aoSubmeterFormulario = () => {
    // Valida os campos
    const valido = validarCampos();

    if (!valido) {
      // Se inválido, sai da função sem enviar
      return;
    }

    // Monta objeto com dados do gasto
    const novoGasto = {
      nome: nomeGasto.trim(),
      valor: Number(valorGasto),
      categoria: categoriaGasto.trim(),
      data: dataGasto.trim(),
    };

    // Chama a função passada pelo pai para tratar o gasto
    onSubmit(novoGasto);

    // Limpa os campos do formulário após enviar
    setNomeGasto('');
    setValorGasto('');
    setCategoriaGasto('');
    setDataGasto('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome do gasto"
        value={nomeGasto}
        onChangeText={(textoDigitado) => setNomeGasto(textoDigitado)}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Valor (ex: 120.50)"
        value={valorGasto}
        onChangeText={(textoDigitado) => setValorGasto(textoDigitado)}
        keyboardType="decimal-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Categoria (ex: Alimentação)"
        value={categoriaGasto}
        onChangeText={(textoDigitado) => setCategoriaGasto(textoDigitado)}
      />
      <TextInput
        style={styles.input}
        placeholder="Data (ex: 01/07/2025)"
        value={dataGasto}
        onChangeText={(textoDigitado) => setDataGasto(textoDigitado)}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={() => {
          aoSubmeterFormulario();
        }}
      >
        <Text style={styles.textoBotao}>Cadastrar Gasto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
  },
  botao: {
    backgroundColor: '#4B7BEC',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotao: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
