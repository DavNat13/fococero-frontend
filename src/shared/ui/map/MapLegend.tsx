import { useState, useRef, useEffect } from 'react';
import { Animated, TouchableOpacity, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface LegendItem {
  id?: string;
  color: string;
  label: string;
  count?: number;
}

interface Props {
  items: LegendItem[];
  title?: string;
}

export function MapLegend({ items, title = 'Leyenda' }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const itemsWithIds = items.map((i) => ({
    ...i,
    id: i.id ?? i.label.toLowerCase().replace(/\s+/g, '-'),
  }));
  const [activeItems, setActiveItems] = useState<Set<string>>(
    () => new Set(itemsWithIds.map((i) => i.id)),
  );
  const animHeight = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(animHeight, {
      toValue: collapsed ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed]);

  const toggleItem = (id: string) => {
    setActiveItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const contentHeight = animHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500],
  });

  return (
    <View className="absolute bottom-44 right-4 overflow-hidden rounded-2xl bg-slate-800/95 p-3 shadow-lg">
      <TouchableOpacity
        className="flex-row items-center justify-between"
        onPress={() => setCollapsed(!collapsed)}
      >
        <Text className="text-xs font-semibold text-gray-200">{title}</Text>
        <MaterialCommunityIcons
          name={collapsed ? 'chevron-up' : 'chevron-down'}
          size={16}
          color="#9CA3AF"
        />
      </TouchableOpacity>
      <Animated.View style={{ maxHeight: contentHeight, overflow: 'hidden', opacity: animHeight }}>
        {itemsWithIds.map((item) => {
          const active = activeItems.has(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center py-1.5"
              onPress={() => toggleItem(item.id)}
              activeOpacity={0.6}
              style={{ opacity: active ? 1 : 0.4 }}
            >
              <View
                className="mr-2 h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color, opacity: active ? 1 : 0.4 }}
              />
              <Text className={`flex-1 text-xs ${active ? 'text-gray-200' : 'text-gray-500'}`}>
                {item.label}
              </Text>
              {item.count !== undefined && (
                <View className="ml-2 rounded-full bg-slate-700 px-1.5 py-0.5">
                  <Text className="text-xs text-gray-300">{item.count}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </View>
  );
}
