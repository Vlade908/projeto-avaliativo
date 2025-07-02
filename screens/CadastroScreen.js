import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  useWindowDimensions,
  AccessibilityInfo,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CadastroScreen({ adicionarGasto }) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tagSelecionada, setTagSelecionada] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [tags, setTags] = useState([]);
  const [mostrarInputNovaTag, setMostrarInputNovaTag] = useState(false);
  const [novaTagNome, setNovaTagNome] = useState('');

  const [submenuModalVisible, setSubmenuModalVisible] = useState(false);
  const [submenuTag, setSubmenuTag] = useState(null);
  const [submenuPos, setSubmenuPos] = useState({ x: 0, y: 0 });

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const [editandoTag, setEditandoTag] = useState(null);
  const [nomeEditado, setNomeEditado] = useState('');

  useEffect(() => {
    async function carregarTags() {
      try {
        const json = await AsyncStorage.getItem('@tags');
        if (json) {
          setTags(JSON.parse(json));
        } else {
          const padrao = [
            { id: '1', nome: 'Alimentação' },
            { id: '2', nome: 'Transporte' },
            { id: '3', nome: 'Lazer' },
          ];
          setTags(padrao);
          await AsyncStorage.setItem('@tags', JSON.stringify(padrao));
        }
      } catch (e) {
        console.error('Erro ao carregar tags', e);
      }
    }
    carregarTags();
  }, []);

  const salvarTags = async (tagsNovas) => {
    setTags(tagsNovas);
    await AsyncStorage.setItem('@tags', JSON.stringify(tagsNovas));
  };

  const adicionarNovaTag = async () => {
    const nome = novaTagNome.trim();
    if (!nome) {
      Alert.alert('Erro', 'Informe um nome válido para a tag.');
      return;
    }
    if (tags.some(t => t.nome.toLowerCase() === nome.toLowerCase())) {
      Alert.alert('Erro', 'Já existe uma tag com esse nome.');
      return;
    }
    const nova = { id: String(Date.now()), nome };
    const novasTags = [...tags, nova];
    await salvarTags(novasTags);
    setNovaTagNome('');
    setMostrarInputNovaTag(false);
  };

  function formatarDataAmigavel(data) {
    const hoje = new Date();
    const ontem = new Date();
    ontem.setDate(hoje.getDate() - 1);

    const dataGasto = new Date(data.getFullYear(), data.getMonth(), data.getDate());
    const dataHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const dataOntem = new Date(ontem.getFullYear(), ontem.getMonth(), ontem.getDate());

    if (dataGasto.getTime() === dataHoje.getTime()) return 'Hoje';
    if (dataGasto.getTime() === dataOntem.getTime()) return 'Ontem';

    const nomesMes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${data.getDate()} ${nomesMes[data.getMonth()]} ${data.getFullYear()}`;
  }

  const onAdicionar = () => {
    if (!descricao.trim() || !valor.trim() || !tagSelecionada) {
      Alert.alert('Erro', 'Preencha descrição, valor e selecione uma tag.');
      return;
    }
    const valorNum = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNum) || valorNum <= 0) {
      Alert.alert('Erro', 'Informe um valor válido maior que zero.');
      return;
    }

    const dataFormatada = formatarDataAmigavel(dataSelecionada);

    adicionarGasto({
      descricao: descricao.trim(),
      valor: valorNum,
      tag: tagSelecionada,
      data: dataFormatada,
    });
    setDescricao('');
    setValor('');
    setTagSelecionada(null);
    setDataSelecionada(new Date());
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.card} accessibilityLabel="formulário de gasto">
        <Text style={styles.titulo}>Adicionar Gasto</Text>

        <TextInput
          placeholder="Descrição"
          style={styles.input}
          value={descricao}
          onChangeText={setDescricao}
          accessibilityLabel="campo descrição"
        />

        <TextInput
          placeholder="Valor"
          style={styles.input}
          keyboardType="decimal-pad"
          value={valor}
          onChangeText={setValor}
          accessibilityLabel="campo valor"
        />

        <TouchableOpacity
          style={styles.input}
          onPress={() => setMostrarDatePicker(true)}
        >
          <Text style={{ color: '#333' }}>
            Data: {formatarDataAmigavel(dataSelecionada)}
          </Text>
        </TouchableOpacity>

        {mostrarDatePicker && (
          <DateTimePicker
            value={dataSelecionada}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setMostrarDatePicker(false);
              if (selectedDate) setDataSelecionada(selectedDate);
            }}
          />
        )}

        <TouchableOpacity
          style={styles.selectTag}
          onPress={() => setModalVisible(true)}
          accessibilityLabel="botão selecionar categoria"
        >
          <Text style={{ color: tagSelecionada ? '#000' : '#aaa' }}>
            {tagSelecionada ? tagSelecionada.nome : 'Selecionar categoria'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={onAdicionar}
          accessibilityLabel="botão salvar gasto"
        >
          <Text style={styles.botaoTexto}>Salvar Gasto</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
          accessibilityLabel="fechar modal de categorias"
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Categorias</Text>

            <FlatList
              data={tags}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setTagSelecionada(item);
                    setModalVisible(false);
                  }}
                  accessibilityLabel={`Selecionar categoria ${item.nome}`}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="pricetag" size={18} color="#4B7BEC" />
                    <Text style={{ fontSize: 16 }}>{item.nome}</Text>
                  </View>
                </TouchableOpacity>
              )}
              ListFooterComponent={
                mostrarInputNovaTag ? (
                  <View style={styles.novaTagInputContainer}>
                    <TextInput
                      placeholder="Nova categoria"
                      value={novaTagNome}
                      onChangeText={setNovaTagNome}
                      style={styles.inputNovaTag}
                      accessibilityLabel="campo nova categoria"
                    />
                    <TouchableOpacity onPress={adicionarNovaTag} accessibilityLabel="confirmar nova categoria">
                      <Ionicons name="checkmark-circle" size={24} color="#4B7BEC" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => setMostrarInputNovaTag(true)}
                    accessibilityLabel="adicionar nova categoria"
                  >
                    <Text style={styles.novaTagBotao}>+ Nova categoria</Text>
                  </TouchableOpacity>
                )
              }
            />
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fc',
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#2f3542',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f1f3f6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  selectTag: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f1f3f6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  botao: {
    backgroundColor: '#4B7BEC',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    color: '#2f3542',
  },
  modalItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  novaTagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    gap: 12,
  },
  inputNovaTag: {
    flex: 1,
    backgroundColor: '#f1f3f6',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  novaTagBotao: {
    marginTop: 16,
    fontSize: 16,
    color: '#4B7BEC',
    textAlign: 'center',
  },
});