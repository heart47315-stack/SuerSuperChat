import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function CreateCharacter() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#7b6b6b", padding: 20, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 22, color: "white", marginBottom: 20 }}>สร้างตัวละคร</Text>

      <View style={{ width: "100%", backgroundColor: "#4f4242", borderRadius: 12, padding: 16 }}>
        <Text style={{ color: "white", marginBottom: 8 }}>ตัวอย่างหน้าสร้างตัวละคร</Text>
        <Text style={{ color: "#dcdcdc" }}>ที่นี่คุณสามารถเลือกรูป เลือกชื่อ และตั้งค่าตัวละคร</Text>
      </View>

      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20, backgroundColor: "#5a4c4c", padding: 12, borderRadius: 12 }}>
        <Text style={{ color: "white" }}>กลับ</Text>
      </TouchableOpacity>
    </View>
  );
}
