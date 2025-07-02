import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

export default function AnimatedGastoItem({ gasto, onPress, onExcluir }) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ],
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(1.03);
    translateY.value = withTiming(-4);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    translateY.value = withSpring(0);
  };

  const renderRightActions = () => (
    <TouchableOpacity style={styles.botaoExcluir} onPress={onExcluir}>
      <Ionicons name="trash" size={24} color="white" />
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <Animated.View style={[styles.animado, animatedStyle]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View style={styles.card}>
            <Text style={styles.nome}>{gasto.nomeGasto || gasto.nome}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.valor}>R$ {gasto.valor}</Text>
              <Text style={styles.categoria}>{gasto.categoria}</Text>
              <Text style={styles.data}>{gasto.data}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  animado: {
    marginVertical: 6,
    marginHorizontal: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 4,
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
  botaoExcluir: {
    backgroundColor: '#d9534f',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 10,
    marginVertical: 8,
    marginRight: 12,
  },
});
