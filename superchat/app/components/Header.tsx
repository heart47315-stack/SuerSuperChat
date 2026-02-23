import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Header({ title, showBack = false }) {
  const router = useRouter();
  return (
    <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, backgroundColor: '#5a4c4c' }}>
      {showBack ? (
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={{ color: 'white' }}>Back</Text>
        </TouchableOpacity>
      ) : null}
      <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>{title}</Text>
    </View>
  );
}
