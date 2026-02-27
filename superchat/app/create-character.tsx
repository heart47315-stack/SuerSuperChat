import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'

export default function CreateCharacter() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [persona, setPersona] = useState('')
  const [image, setImage] = useState<string | null>(null)

  // ฟังก์ชันเลือกภาพจากเครื่อง
  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  // ฟังก์ชันกดปุ่มสร้างตัวละคร
  function submit() {
    if (!name) return Alert.alert('กรุณากรอกชื่อ')

    // สร้าง id แบบสุ่ม
    const id = Math.random().toString(36).slice(2, 9)

    // ส่งข้อมูลตัวละครไปหน้า chat/[id]
    router.push({
      pathname: '/chat/[id]',
      params: { id, name, persona, image },
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#7b6b6b', padding: 20 }}>
      <Text style={{ fontSize: 22, color: 'white', marginBottom: 12 }}>สร้างตัวละคร</Text>

      <Text style={{ color: 'white', marginBottom: 6 }}>ชื่อ</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="กรอกชื่อ"
        style={{
          backgroundColor: 'white',
          padding: 10,
          borderRadius: 8,
          marginBottom: 10,
        }}
      />

      <Text style={{ color: 'white', marginBottom: 6 }}>บุคลิก / คำอธิบาย</Text>
      <TextInput
        value={persona}
        onChangeText={setPersona}
        placeholder="กรอกบุคลิกหรือคำอธิบาย"
        multiline
        style={{
          backgroundColor: 'white',
          padding: 10,
          borderRadius: 8,
          height: 100,
          marginBottom: 10,
        }}
      />

      <TouchableOpacity
        onPress={pickImage}
        style={{
          backgroundColor: '#4c3f3f',
          padding: 12,
          borderRadius: 8,
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <Text style={{ color: 'white' }}>เลือกภาพ</Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 100, height: 100, borderRadius: 8, marginBottom: 10 }}
        />
      )}

      <TouchableOpacity
        onPress={submit}
        style={{
          backgroundColor: '#5a4c4c',
          padding: 12,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white' }}>สร้างตัวละคร</Text>
      </TouchableOpacity>
    </View>
  )
}