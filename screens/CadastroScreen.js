import React, { useState, useEffect, useRef } from 'react';
import {
  View,
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
  Animated,
  AccessibilityInfo,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import Titulo from '../components/Titulo'; 

export default function CadastroScreen({ adicionarGasto }) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tagSelecionada, setTagSelecionada] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [tags, setTags] = useState([]);
  const [mostrarInputNovaTag, setMostrarInputNovaTag] = useState(false);
  const [novaTagNome, setNovaTagNome] = useState('');

  const [inputErroDescricao, setInputErroDescricao] = useState(false);
  const [inputErroValor, setInputErroValor] = useState(false);
  const [inputErroTag, setInputErroTag] = useState(false);

  const [botaoAnim] = useState(new Animated.Value(1));

  const modalAnimOpacity = useRef(new Animated.Value(0)).current;
  const modalAnimScale = useRef(new Animated.Value(0.8)).current;

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const valorRef = useRef(null);

  useEffect(() => {
    async function carregarTags() {
      try {
        const json = await AsyncStorage.getItem('@tags');
        if (json) {
          const tagsSalvas = JSON.parse(json);
          const tagsComIcone = tagsSalvas.map(t => ({
            ...t,
            icon: t.icon ? t.icon : 'pricetag-outline',
          }));
          setTags(tagsComIcone);
        } else {
          const padrao = [
            { id: '1', nome: 'Alimentação', icon: 'fast-food-outline' },
            { id: '2', nome: 'Transporte', icon: 'bus-outline' },
            { id: '3', nome: 'Lazer', icon: 'game-controller-outline' },
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
    const tagsComIcone = tagsNovas.map(t => ({
      ...t,
      icon: t.icon ? t.icon : 'pricetag-outline',
    }));
    setTags(tagsComIcone);
    await AsyncStorage.setItem('@tags', JSON.stringify(tagsComIcone));
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
    const nova = { id: String(Date.now()), nome, icon: 'pricetag-outline' };
    const novasTags = [...tags, nova];
    await salvarTags(novasTags);
    setNovaTagNome('');
    setMostrarInputNovaTag(false);
  };

  const abrirModal = () => {
    setModalVisible(true);
    setMostrarInputNovaTag(false);
    modalAnimOpacity.setValue(0);
    modalAnimScale.setValue(0.8);
    Animated.parallel([
      Animated.timing(modalAnimOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(modalAnimScale, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fecharModal = () => {
    Animated.parallel([
      Animated.timing(modalAnimOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalAnimScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
    });
  };

  const onAdicionar = () => {
    const descricaoTrim = descricao.trim();
    const valorNum = parseFloat(valor.replace(',', '.'));
    let valid = true;

    if (!descricaoTrim) {
      setInputErroDescricao(true);
      valid = false;
    } else setInputErroDescricao(false);

    if (!valor.trim() || isNaN(valorNum) || valorNum <= 0) {
      setInputErroValor(true);
      valid = false;
    } else setInputErroValor(false);

    if (!tagSelecionada) {
      setInputErroTag(true);
      valid = false;
    } else setInputErroTag(false);

    if (!valid) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos corretamente.');
      AccessibilityInfo.announceForAccessibility(
        'Erro: Preencha descrição, valor e selecione uma categoria.'
      );
      return;
    }

    Animated.sequence([
      Animated.timing(botaoAnim, { toValue: 0.7, duration: 100, useNativeDriver: true }),
      Animated.timing(botaoAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    adicionarGasto({
      descricao: descricaoTrim,
      valor: valorNum,
      tag: tagSelecionada,
    });

    setDescricao('');
    setValor('');
    setTagSelecionada(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Titulo texto="Adicionar Gasto" />

      <View style={styles.card} accessible accessibilityLabel="Formulário para adicionar gasto">
        <TextInput
          placeholder="Descrição"
          style={[styles.input, inputErroDescricao && styles.inputErro]}
          value={descricao}
          onChangeText={text => {
            setDescricao(text);
            if (inputErroDescricao) setInputErroDescricao(false);
          }}
          accessibilityLabel="Campo descrição"
          accessibilityHint="Digite a descrição do gasto"
          returnKeyType="next"
          onSubmitEditing={() => valorRef.current?.focus()}
          blurOnSubmit={false}
        />

        <TextInput
          ref={valorRef}
          placeholder="Valor"
          style={[styles.input, inputErroValor && styles.inputErro]}
          keyboardType="decimal-pad"
          value={valor}
          onChangeText={text => {
            setValor(text);
            if (inputErroValor) setInputErroValor(false);
          }}
          accessibilityLabel="Campo valor"
          accessibilityHint="Digite o valor do gasto"
          returnKeyType="done"
          onSubmitEditing={onAdicionar}
        />

        <TouchableOpacity
          style={[styles.selectTag, inputErroTag && styles.inputErro]}
          onPress={abrirModal}
          accessibilityRole="button"
          accessibilityLabel="Selecionar categoria"
          accessibilityHint="Abre modal para selecionar a categoria do gasto"
        >
          <Text style={{ color: tagSelecionada ? '#000' : '#aaa', fontSize: 16 }}>
            {tagSelecionada ? tagSelecionada.nome : 'Selecionar categoria'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#aaa" />
        </TouchableOpacity>

        <Animated.View style={{ transform: [{ scale: botaoAnim }] }}>
          <TouchableOpacity
            style={styles.botao}
            onPress={onAdicionar}
            accessibilityRole="button"
            accessibilityLabel="Salvar gasto"
          >
            <Text style={styles.botaoTexto}>Salvar Gasto</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={fecharModal}
        animationType="none"
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={fecharModal}
          accessible={false}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                opacity: modalAnimOpacity,
                transform: [{ scale: modalAnimScale }],
              },
            ]}
            accessibilityViewIsModal
          >
            <Text style={styles.modalTitulo} accessibilityRole="header">
              Categorias
            </Text>

            <FlatList
              data={tags}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    tagSelecionada?.id === item.id && styles.modalItemSelecionado,
                  ]}
                  onPress={() => {
                    setTagSelecionada(item);
                    fecharModal();
                    if (inputErroTag) setInputErroTag(false);
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: tagSelecionada?.id === item.id }}
                  accessibilityLabel={`Categoria ${item.nome}`}
                >
                  <Ionicons
                    name={item.icon || 'pricetag-outline'}
                    size={20}
                    color={tagSelecionada?.id === item.id ? '#4B7BEC' : '#666'}
                    style={{ marginRight: 12 }}
                    accessibilityIgnoresInvertColors
                  />
                  <Text style={{ fontSize: 16, color: tagSelecionada?.id === item.id ? '#4B7BEC' : '#000' }}>
                    {item.nome}
                  </Text>
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
                      autoFocus
                      accessibilityLabel="Nome da nova categoria"
                    />
                    <TouchableOpacity
                      onPress={adicionarNovaTag}
                      accessibilityRole="button"
                      accessibilityLabel="Confirmar nova categoria"
                    >
                      <Ionicons name="checkmark-circle" size={28} color="#4B7BEC" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => setMostrarInputNovaTag(true)}
                    style={styles.novaTagBotao}
                    accessibilityRole="button"
                    accessibilityLabel="Adicionar nova categoria"
                  >
                    <Text style={styles.novaTagBotaoTexto}>+ Nova categoria</Text>
                  </TouchableOpacity>
                )
              }
            />
          </Animated.View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fbff',
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 0, // sem padding top pois o título já tem
    justifyContent: 'flex-start',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#f1f4f8',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 17,
    color: '#333',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputErro: {
    borderColor: '#e74c3c',
  },
  selectTag: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f1f4f8',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 24,
  },
  botao: {
    backgroundColor: '#4B7BEC',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#4B7BEC',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 28,
    maxHeight: '80%',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
  },
  modalTitulo: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#222',
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  modalItemSelecionado: {
    backgroundColor: '#d5e4fd',
  },
  novaTagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    gap: 12,
  },
  inputNovaTag: {
    flex: 1,
    backgroundColor: '#f1f4f8',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#4B7BEC',
  },
  novaTagBotao: {
    marginTop: 22,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#4B7BEC',
    alignItems: 'center',
  },
  novaTagBotaoTexto: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
