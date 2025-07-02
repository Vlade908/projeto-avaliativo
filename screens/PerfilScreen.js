import React, { useState, useEffect, useRef } from 'react';
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
  Platform,
  KeyboardAvoidingView,
  Animated,
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

  const fadeAnim = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible, fadeAnim]);

  const escolherAvatarGenerico = () => {
    const id = Math.floor(Math.random() * 70) + 1;
    const imageUrl = `https://i.pravatar.cc/150?img=${id}&t=${Date.now()}`;
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
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
        </View>

        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => setModalVisible(true)}
          accessibilityRole="imagebutton"
          accessibilityLabel="Alterar foto do perfil"
        >
          <Image
            source={{ uri: avatar || avatarGenerico }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={styles.cameraIconWrapper}>
            <Text style={styles.cameraIcon}>📷</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.form}>
          <TextInput
            placeholder="Nome"
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholderTextColor="#999"
            accessibilityLabel="Campo para inserir nome"
          />
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
            accessibilityLabel="Campo para inserir email"
          />
        </View>

        <Modal
          visible={modalVisible}
          transparent
          animationType="none"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPressOut={() => setModalVisible(false)}
            style={styles.modalOverlay}
          >
            <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={escolherAvatarGenerico}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonText}>Avatar genérico</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                onPress={escolherImagemDoDispositivo}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonText}>Escolher foto</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalButtonText, styles.modalCancelText]}>Cancelar</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    width: '100%',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#4B7BEC',
    backgroundColor: '#d1d5db',
  },
  cameraIconWrapper: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#4B7BEC',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4B7BEC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
  },
  cameraIcon: {
    color: '#fff',
    fontSize: 22,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 18,
    marginBottom: 20,
    color: '#374151',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(31, 41, 55, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  modalButton: {
    backgroundColor: '#4B7BEC',
    borderRadius: 14,
    paddingVertical: 16,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4B7BEC',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  modalCancelButton: {
    backgroundColor: '#ef4444',
  },
  modalCancelText: {
    fontWeight: '700',
  },
});
