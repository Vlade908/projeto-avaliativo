import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  SafeAreaView,
  Alert,
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const avatarGenerico =
  'https://cdn-icons-png.flaticon.com/512/149/149071.png';

export default function PerfilScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('@perfil_nome').then((valor) => {
      if (valor !== null) setNome(valor);
    });
    AsyncStorage.getItem('@perfil_email').then((valor) => {
      if (valor !== null) setEmail(valor);
    });
    AsyncStorage.getItem('@perfil_avatar').then((valor) => {
      if (valor !== null) setAvatar(valor);
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@perfil_nome', nome).catch(() => {
      Alert.alert('Erro', 'Não foi possível salvar o nome');
    });
  }, [nome]);

  useEffect(() => {
    AsyncStorage.setItem('@perfil_email', email).catch(() => {
      Alert.alert('Erro', 'Não foi possível salvar o email');
    });
  }, [email]);

  useEffect(() => {
    if (avatar) {
      AsyncStorage.setItem('@perfil_avatar', avatar).catch(() => {
        Alert.alert('Erro', 'Não foi possível salvar o avatar');
      });
    }
  }, [avatar]);

  const escolherAvatarGenerico = () => {
    const id = Math.floor(Math.random() * 70) + 1;
    const imageUrl = `https://i.pravatar.cc/150?img=${id}&t=${Date.now()}`;
    console.log('URL do avatar genérico:', imageUrl);
    setAvatar(imageUrl);
    setModalVisible(false);
  };

  const escolherImagemDoDispositivo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão negada',
          'Permita o acesso à galeria para escolher a foto.'
        );
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!resultado.canceled) {
        setAvatar(resultado.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Erro', 'Erro ao abrir a galeria.');
    } finally {
      setModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Perfil do Usuário</Text>
        </View>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={{ uri: avatar ? avatar : avatarGenerico }}
            style={styles.avatar}
          />
        </TouchableOpacity>

        <View style={styles.inptext}>
          <TextInput
            placeholder="Nome"
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.infoExibicao}>
            <Text style={styles.infoTexto}>Nome: {nome || '-'}</Text>
            <Text style={styles.infoTexto}>Email: {email || '-'}</Text>
          </View>
        </View>
        
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalFundo}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.botaoModal}
                onPress={escolherAvatarGenerico}
              >
                <Text style={styles.textoBotaoModal}>Usar avatar genérico</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoModal}
                onPress={escolherImagemDoDispositivo}
              >
                <Text style={styles.textoBotaoModal}>Escolher foto do aparelho</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botaoModal, styles.botaoCancelar]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textoBotaoModal}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    alignItems: 'center',
  },
  inptext: {
    display: 'flex',
    alignItems: 'center',
    width: '60%',
  },
  header: {
    width: '100%',
    paddingVertical: 24,
    backgroundColor: '#4B7BEC',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    elevation: 5,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#4B7BEC',
    backgroundColor: '#eee', // Para ajudar a visualizar durante o teste
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    color: '#000',
  },
  infoExibicao: {
    marginTop: 10,
    width: '100%',
  },
  infoTexto: {
    fontSize: 18,
    marginVertical: 5,
    color: '#333',
  },
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    width: '80%',
    alignItems: 'center',
  },
  botaoModal: {
    backgroundColor: '#4B7BEC',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  textoBotaoModal: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoCancelar: {
    backgroundColor: '#d9534f',
  },
});
