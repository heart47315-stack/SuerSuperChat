import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

export default function Admin() {
  const [items, setItems] = useState([]);
  const router = useRouter();

  const ADMIN_KEY_STORAGE = 'admin_key';

  async function getAdminKey() {
    return await SecureStore.getItemAsync(ADMIN_KEY_STORAGE);
  }

  async function load() {
    const key = await getAdminKey();
    if (!key) return router.push('/admin-login');
    const r = await fetch('http://localhost:4000/admin/characters', { headers: { 'x-admin-key': key } });
    const data = await r.json();
    setItems(data);
  }

  useEffect(()=>{ load(); }, []);

  async function setStatus(id, status) {
    await fetch(`http://localhost:4000/admin/characters/${id}/status`, { method:'PATCH', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ status }) });
    Alert.alert('Updated');
    load();
  }

  return (
    <View style={{ flex:1, padding:12, backgroundColor:'#7b6b6b' }}>
      <Text style={{ color:'white', fontSize:18, marginBottom:8 }}>Admin - Characters</Text>
      <FlatList data={items} keyExtractor={(i)=>i.id} renderItem={({item})=> (
        <View style={{ backgroundColor:'#4f4242', padding:12, borderRadius:8, marginBottom:8 }}>
          <Text style={{ color:'white', fontSize:16 }}>{item.name} — {item.status}</Text>
          <View style={{ flexDirection:'row', marginTop:8 }}>
            <TouchableOpacity onPress={()=>setStatus(item.id,'active')} style={{ marginRight:8, backgroundColor:'#2a8', padding:8, borderRadius:6 }}><Text>Enable</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>setStatus(item.id,'flagged')} style={{ marginRight:8, backgroundColor:'#f5a623', padding:8, borderRadius:6 }}><Text>Flag</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>setStatus(item.id,'banned')} style={{ marginRight:8, backgroundColor:'#f88', padding:8, borderRadius:6 }}><Text>Disable</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>setStatus(item.id,'pending')} style={{ backgroundColor:'#888', padding:8, borderRadius:6 }}><Text>Pending</Text></TouchableOpacity>
            <TouchableOpacity onPress={async ()=>{
                // fetch moderation logs for this character (requires admin key)
                            try {
                              const key = await getAdminKey();
                              if (!key) return router.push('/admin-login');
                              const r = await fetch(`http://localhost:4000/admin/moderation/${item.id}`, { headers: { 'x-admin-key': key } });
                              const logs = await r.json();
                              Alert.alert('Moderation', logs.map(l => `${new Date(l.created_at).toLocaleString()}: ${l.reason || l.provider}`).join('\n\n') || 'No logs');
                            } catch(e) { Alert.alert('Error', String(e)); }
              }} style={{ marginLeft:8, backgroundColor:'#66f', padding:8, borderRadius:6 }}><Text>View Flags</Text></TouchableOpacity>
          </View>
        </View>
      )} />
    </View>
  );
}
