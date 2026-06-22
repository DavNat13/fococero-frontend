import { useState, useRef, useEffect } from 'react';
import { Animated, TouchableOpacity, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  selectedLayer: string;
  onLayerChange: (layer: string) => void;
  top?: number;
}

const LAYERS = ['Estandar', 'Satelital', 'Oscuro', 'Relieve'];

export function LayerSelector({ selectedLayer, onLayerChange, top }: Props) {
  const [expanded, setExpanded] = useState(false);
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: expanded ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  const dropdownHeight = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <View className="absolute left-4 z-50" style={{ top: top ?? 16 }}>
      {expanded && (
        <TouchableOpacity
          className="absolute bg-transparent"
          style={{ top: -500, left: -500, right: -500, bottom: -500 }}
          activeOpacity={1}
          onPress={() => setExpanded(false)}
        />
      )}
      <TouchableOpacity
        className="flex-row items-center rounded-full bg-slate-800/95 px-4 py-2 shadow-lg"
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
      >
        <Text className="text-sm text-white">{selectedLayer}</Text>
        <MaterialCommunityIcons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color="white"
          className="ml-1"
        />
      </TouchableOpacity>
      <Animated.View style={{ maxHeight: dropdownHeight, opacity: animValue, overflow: 'hidden' }}>
        <View className="mt-1 rounded-xl bg-slate-800/95 p-1 shadow-lg">
          {LAYERS.map((layer) => {
            const isSelected = layer === selectedLayer;
            return (
              <TouchableOpacity
                key={layer}
                className={`rounded-lg px-3 py-2 ${isSelected ? 'bg-amber-500/20' : ''}`}
                onPress={() => {
                  onLayerChange(layer);
                  setExpanded(false);
                }}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-sm ${isSelected ? 'font-semibold text-amber-400' : 'text-gray-300'}`}
                >
                  {layer}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>
    </View>
  );
}
