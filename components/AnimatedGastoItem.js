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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
    shadowOpacity: withTiming(scale.value === 1 ? 0.15 : 0.3),
  }));

  const handlePressIn = () => {
    scale.value = withTiming(1.03, { duration: 150 });
    translateY.value = withTiming(-4, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 120 });
    translateY.value = withSpring(0, { damping: 12, stiffness: 120 });
  };

  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.botaoExcluir}
      onPress={onExcluir}
      accessibilityRole="button"
      accessibilityLabel="Excluir gasto"
    >
      <Ionicons name="trash" size={28} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootRight={false}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityRole="button"
          accessibilityLabel={`Gasto: ${gasto.descricao}, valor R$${gasto.valor.toFixed(2)}, categoria ${gasto.tag?.nome}, data ${gasto.data}`}
        >
          <View style={styles.card}>
            <View style={styles.topRow}>
              <Text style={styles.nome} numberOfLines={1} ellipsizeMode="tail">
                {gasto.descricao}
              </Text>
              <Text style={styles.data}>{gasto.data}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.categoria}>{gasto.tag?.nome}</Text>
              <Text style={styles.valor}>R$ {gasto.valor.toFixed(2)}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    backgroundColor: 'transparent',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 20,
    elevation: 5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nome: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    flexShrink: 1,
  },
  data: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoria: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  valor: {
    fontSize: 16,
    color: '#4B7BEC',
    fontWeight: '600',
  },
  botaoExcluir: {
    backgroundColor: '#d9534f',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 14,
    marginVertical: 8,
    marginRight: 16,
    shadowColor: '#d9534f',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
});
