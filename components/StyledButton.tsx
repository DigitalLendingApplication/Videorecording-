import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  TouchableOpacityProps,
  GestureResponderEvent
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface StyledButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  primary?: boolean;
}

export function StyledButton({ 
  title, 
  onPress, 
  primary = true,
  style,
  ...otherProps 
}: StyledButtonProps) {
  const backgroundColor = useThemeColor(
    { light: primary ? '#2196F3' : '#f0f0f0', dark: primary ? '#0D47A1' : '#333333' },
    primary ? 'tint' : 'background'
  );
  
  const textColor = useThemeColor(
    { light: primary ? '#ffffff' : '#333333', dark: primary ? '#ffffff' : '#f0f0f0' },
    primary ? 'background' : 'text'
  );

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }, style]}
      onPress={onPress}
      {...otherProps}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 