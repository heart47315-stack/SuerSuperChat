import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import { useRouter } from 'expo-router'

export default function CreateCharacter() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [persona, setPersona] = useState('')
  const [image, setImage] = useState(null)

  function submit() {
    if (!name) return Alert.alert('Please enter a name')
    // Fake creation: generate a random id and navigate to chat
    const id = Math.random().toString(36).slice(2, 9)
    router.push(`/chat/${id}`)
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#7b6b6b', padding: 20 }}>
      <Text style={{ fontSize: 22, color: 'white', marginBottom: 12 }}>Create Character</Text>

      <Text style={{ color: 'white', marginBottom: 6 }}>Name</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Name" style={{ backgroundColor: 'white', padding: 10, borderRadius: 8, marginBottom: 10 }} />

      <Text style={{ color: 'white', marginBottom: 6 }}>Persona / Description</Text>
      <TextInput value={persona} onChangeText={setPersona} placeholder="Persona" multiline style={{ backgroundColor: 'white', padding: 10, borderRadius: 8, height: 100, marginBottom: 10 }} />

      <TouchableOpacity onPress={submit} style={{ backgroundColor: '#5a4c4c', padding: 12, borderRadius: 8, alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>Create Character</Text>
      </TouchableOpacity>
    </View>
  )
}
