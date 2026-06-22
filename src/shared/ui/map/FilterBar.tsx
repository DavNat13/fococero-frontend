import { View, TouchableOpacity, Text } from 'react-native';

interface FilterOption {
  key: string;
  label: string;
}

interface Props {
  options: FilterOption[];
  activeKey: string;
  onSelect: (key: string) => void;
  className?: string;
}

export function FilterBar({ options, activeKey, onSelect, className = '' }: Props) {
  return (
    <View
      className={`pointer-events-none absolute bottom-24 left-0 right-0 z-10 items-center ${className}`}
    >
      <View className="pointer-events-auto flex-row rounded-xl border border-[#1F2938] bg-[#0C0F17]/90 p-1">
        {options.map(({ key, label }) => {
          const isActive = activeKey === key;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => onSelect(key)}
              activeOpacity={0.7}
              className={`rounded-lg px-4 py-2 ${isActive ? 'bg-[#EA580C]' : 'bg-transparent'}`}
            >
              <Text
                className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-400'}`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
