import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import Header from './components/Header'

export default function Login() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleLogin() {
    // Fake login logic: username 'user' and password 'pass'
    if (username === 'user' && password === 'pass') {
      router.push('')
    } else {
      setError('Invalid credentials — try user / pass')
    }
  }

  return (
    <View style={styles.container}>
      <Header title="Login" />
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Login (user / pass)" onPress={handleLogin} />
      <View style={styles.row}>
        <TouchableOpacity onPress={() => router.push('/app/register')} style={styles.link}>
          <Text style={styles.linkText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/app/admin-login')} style={styles.link}>
          <Text style={styles.linkText}>Admin Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 48 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, borderRadius: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  link: { padding: 8 },
  linkText: { color: '#0a84ff' },
  error: { color: 'red', marginBottom: 8 },
})