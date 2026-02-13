import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView } from 'react-native';
import { useSearchParams } from 'expo-router';

export default function ChatScreen() {
  const { id } = useSearchParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // load recent messages
    async function load() {
      try {
        // fetch recent chat logs
        const r = await fetch(`http://localhost:4000/chat/logs/${id}`);
        const data = await r.json();
        setMessages(data.map(m=>({ role: m.role, content: m.message })));
      } catch (e) {
        console.warn(e);
      }
    }
    load();
  }, [id]);

  async function send() {
    if (!text) return;
    setLoading(true);
    try {
      const r = await fetch('http://localhost:4000/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: 'local-user', character_id: id, message: text }) });
      const data = await r.json();
      setMessages(prev => [...prev, { role: 'user', content: text }, { role: 'assistant', content: data.reply }]);
      setText('');
    } catch (e) {
      console.warn(e);
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#7b6b6b', padding: 12 }} behavior="padding">
      <FlatList data={messages} keyExtractor={(item,idx)=>String(idx)} renderItem={({item})=> (
        <View style={{ marginVertical:6, alignSelf: item.role==='user' ? 'flex-end' : 'flex-start', backgroundColor: item.role==='user' ? '#5a4c4c' : '#4f4242', padding:10, borderRadius:8 }}>
          <Text style={{ color:'white' }}>{item.content}</Text>
        </View>
      )} />

      <View style={{ flexDirection:'row', alignItems:'center', marginTop:8 }}>
        <TextInput value={text} onChangeText={setText} placeholder="พิมพ์ข้อความ" style={{ flex:1, backgroundColor:'white', padding:10, borderRadius:8 }} />
        <TouchableOpacity onPress={send} style={{ marginLeft:8, backgroundColor:'#5a4c4c', padding:10, borderRadius:8 }}>
          <Text style={{ color:'white' }}>{loading ? '...' : 'ส่ง'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
