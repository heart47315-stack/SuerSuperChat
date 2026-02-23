import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

const ADMIN_KEY_STORAGE = 'admin_key';

export default function AdminLogin() {
  const [key, setKey] = useState('');
  const router = useRouter();

  useEffect(()=>{
    (async ()=>{
      const existing = await SecureStore.getItemAsync(ADMIN_KEY_STORAGE);
      if (existing) {
        router.replace('/admin');
      }
    })();
  },[]);

  async function submit() {
    if (!key) return Alert.alert('กรุณากรอกคีย์');
    await SecureStore.setItemAsync(ADMIN_KEY_STORAGE, key);
    router.replace('/admin');
  }

  return (
    <View style={{ flex:1, padding:16, backgroundColor:'#7b6b6b', justifyContent:'center' }}>
      <Text style={{ color:'white', fontSize:20, marginBottom:12 }}>Admin Login</Text>
      <TextInput value={key} onChangeText={setKey} placeholder='Admin Key' style={{ backgroundColor:'white', padding:10, borderRadius:8, marginBottom:12 }} />
      <TouchableOpacity onPress={submit} style={{ backgroundColor:'#5a4c4c', padding:12, borderRadius:8, alignItems:'center' }}>
        <Text style={{ color:'white' }}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
