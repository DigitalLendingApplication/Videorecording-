import React from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView, Platform } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface VideoHeaderProps {
  title: string;
}

export function VideoHeader({ title }: VideoHeaderProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar />
      <View style={styles.header}>
        <IconSymbol name="video.fill" size={24} color={textColor} style={styles.icon} />
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  icon: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
}); 