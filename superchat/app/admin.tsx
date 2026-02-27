import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

export default function Admin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);   // state สำหรับแสดง loading
  const [error, setError] = useState<string | null>(null); // state สำหรับ error
  const router = useRouter();

  const ADMIN_KEY_STORAGE = 'admin_key';

  async function getAdminKey() {
    return await SecureStore.getItemAsync(ADMIN_KEY_STORAGE);
  }

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const key = await getAdminKey();
      if (!key) {
        router.push('admin-login');
        return;
      }
      const r = await fetch('http://localhost:4000/admin/characters', {
        headers: { 'x-admin-key': key },
      });
      if (!r.ok) throw new Error(`โหลดข้อมูลล้มเหลว: ${r.status}`);
      const data = await r.json();
      setItems(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: string) {
    try {
      setLoading(true);
      const r = await fetch(`http://localhost:4000/admin/characters/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!r.ok) throw new Error(`อัปเดตสถานะล้มเหลว: ${r.status}`);
      Alert.alert('Updated', `สถานะถูกเปลี่ยนเป็น ${status}`);
      load();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 12, backgroundColor: '#7b6b6b' }}>
      <Text style={{ color: 'white', fontSize: 18, marginBottom: 8 }}>Admin - Characters</Text>

      {loading && <ActivityIndicator size="large" color="#fff" style={{ marginVertical: 10 }} />}
      {error && <Text style={{ color: 'red', marginBottom: 10 }}>เกิดข้อผิดพลาด: {error}</Text>}

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#4f4242', padding: 12, borderRadius: 8, marginBottom: 8 }}>
            <Text style={{ color: 'white', fontSize: 16 }}>
              {item.name} — {item.status}
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <TouchableOpacity
                onPress={() => setStatus(item.id, 'active')}
                style={{ marginRight: 8, backgroundColor: '#2a8', padding: 8, borderRadius: 6 }}
              >
                <Text style={{ color: 'white' }}>Enable</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setStatus(item.id, 'flagged')}
                style={{ marginRight: 8, backgroundColor: '#f5a623', padding: 8, borderRadius: 6 }}
              >
                <Text style={{ color: 'white' }}>Flag</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setStatus(item.id, 'banned')}
                style={{ marginRight: 8, backgroundColor: '#f88', padding: 8, borderRadius: 6 }}
              >
                <Text style={{ color: 'white' }}>Disable</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setStatus(item.id, 'pending')}
                style={{ backgroundColor: '#888', padding: 8, borderRadius: 6 }}
              >
                <Text style={{ color: 'white' }}>Pending</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  try {
                    const key = await getAdminKey();
                    if (!key) return router.push('admin-login');
                    const r = await fetch(`http://localhost:4000/admin/moderation/${item.id}`, {
                      headers: { 'x-admin-key': key },
                    });
                    if (!r.ok) throw new Error(`โหลด logs ล้มเหลว: ${r.status}`);
                    const logs = await r.json();
                    Alert.alert(
                      'Moderation',
                      logs.map((l: any) => `${new Date(l.created_at).toLocaleString()}: ${l.reason || l.provider}`).join('\n\n') || 'No logs'
                    );
                  } catch (e: any) {
                    Alert.alert('Error', e.message);
                  }
                }}
                style={{ marginLeft: 8, backgroundColor: '#66f', padding: 8, borderRadius: 6 }}
              >
                <Text style={{ color: 'white' }}>View Flags</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}