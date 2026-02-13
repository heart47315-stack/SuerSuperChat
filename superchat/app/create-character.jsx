import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";

export default function CreateCharacter() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [persona, setPersona] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function pickImage() {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
      base64: true,
    });
    if (!res.cancelled) {
      setImage(`data:image/jpeg;base64,${res.base64}`);
    }
  }

  async function submit() {
    if (!name) return Alert.alert('กรุณากรอกชื่อ');
    setLoading(true);
    try {
      let imageUrl = null;
      if (image && image.startsWith('data:')) {
        // upload image to server first
        const up = await fetch('http://localhost:4000/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image }),
        });
        const upj = await up.json();
        imageUrl = upj.url;
      }

      const resp = await fetch('http://localhost:4000/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, persona_description: persona, image: imageUrl }),
      });
      const data = await resp.json();
      setLoading(false);
      if (data.id) {
        router.push(`/chat/${data.id}`);
      } else {
        Alert.alert('เกิดข้อผิดพลาด');
      }
    } catch (e) {
      setLoading(false);
      Alert.alert('Network error', String(e));
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#7b6b6b', padding: 20 }}>
      <Text style={{ fontSize: 22, color: 'white', marginBottom: 12 }}>สร้างตัวละคร</Text>

      <Text style={{ color: 'white', marginBottom: 6 }}>ชื่อ</Text>
      <TextInput value={name} onChangeText={setName} placeholder="ชื่อ" style={{ backgroundColor: 'white', padding: 10, borderRadius: 8, marginBottom: 10 }} />

      <Text style={{ color: 'white', marginBottom: 6 }}>นิสัย / คำอธิบาย</Text>
      <TextInput value={persona} onChangeText={setPersona} placeholder="นิสัย" multiline style={{ backgroundColor: 'white', padding: 10, borderRadius: 8, height: 100, marginBottom: 10 }} />

      <TouchableOpacity onPress={pickImage} style={{ backgroundColor: '#4f4242', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ color: 'white' }}>{image ? 'เปลี่ยนรูป' : 'เลือกภาพ'}</Text>
      </TouchableOpacity>
      {image ? <Image source={{ uri: image }} style={{ width: 120, height: 120, borderRadius: 8, marginBottom: 10 }} /> : null}

      <TouchableOpacity onPress={submit} style={{ backgroundColor: '#5a4c4c', padding: 12, borderRadius: 8, alignItems: 'center' }}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white' }}>สร้างตัวละคร</Text>}
      </TouchableOpacity>
    </View>
  );
}
