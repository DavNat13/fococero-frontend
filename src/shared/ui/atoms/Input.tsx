// src/shared/ui/atoms/Input.tsx
import React, { forwardRef, useState } from 'react';
import { View, TextInput, TextInputProps, Pressable } from 'react-native';
import { Typography } from './Typography';
import { ShakeError } from '../animations/ShakeError';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, leftIcon, rightIcon, isPassword = false, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isHidden, setIsHidden] = useState(isPassword);

    const isMultiline = props.multiline;
    const borderColor = error
      ? 'border-red-500 bg-red-500/5'
      : isFocused
        ? 'border-[#EA580C] bg-[#020617]'
        : 'border-slate-800 bg-slate-900/50';

    const heightClass = isMultiline ? 'min-h-[130px] h-auto py-3' : 'h-14';
    const alignClass = isMultiline ? 'items-start' : 'items-center';

    return (
      <View className={`w-full ${className}`}>
        {label && (
          <Typography variant="label" color="secondary" className="mb-2 ml-1">
            {label}
          </Typography>
        )}

        <ShakeError trigger={!!error}>
          <View
            className={`w-full flex-row rounded-2xl border-2 px-4 transition-colors ${heightClass} ${alignClass} ${borderColor}`}
          >
            {leftIcon && <View className="mr-3 mt-3 opacity-70">{leftIcon}</View>}

            <TextInput
              ref={ref}
              placeholderTextColor="#64748B"
              secureTextEntry={isHidden}
              onFocus={(e) => {
                setIsFocused(true);
                props.onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                props.onBlur?.(e);
              }}
              className="min-h-full flex-1 font-inter text-base text-slate-100"
              multiline={isMultiline}
              textAlignVertical={isMultiline ? 'top' : 'center'}
              numberOfLines={isMultiline ? 4 : undefined}
              style={isMultiline ? { lineHeight: 22 } : undefined}
              {...props}
            />

            {isPassword ? (
              <Pressable
                onPress={() => setIsHidden(!isHidden)}
                className="ml-3 p-1"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Typography variant="caption" color={isHidden ? 'secondary' : 'brand'}>
                  {isHidden ? 'VER' : 'OCULTAR'}
                </Typography>
              </Pressable>
            ) : rightIcon ? (
              <View className="ml-3">{rightIcon}</View>
            ) : null}
          </View>
        </ShakeError>

        {error && (
          <Typography variant="caption" color="danger" className="ml-1 mt-2">
            {error}
          </Typography>
        )}
      </View>
    );
  },
);

Input.displayName = 'Input';
