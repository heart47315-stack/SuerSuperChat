import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Register() {
  const router = useRouter();

  // สร้าง state สำหรับเก็บค่าที่ผู้ใช้กรอก
  const [name, setName] = useState("");       // ชื่อ
  const [email, setEmail] = useState("");     // อีเมล
  const [password, setPassword] = useState(""); // รหัสผ่าน
  const [confirm, setConfirm] = useState("");   // ยืนยันรหัสผ่าน

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#7b6b6b",
        justifyContent: "center",
        padding: 20,
      }}
    >
      {/* หัวข้อหน้าลงทะเบียน */}
      <Text style={{ fontSize: 24, color: "white", textAlign: "center", marginBottom: 20 }}>
        ลงทะเบียน
      </Text>

      {/* ช่องกรอกชื่อ */}
      <TextInput
        placeholder="ชื่อ"
        value={name}
        onChangeText={setName}
        style={input}
      />

      {/* ช่องกรอกอีเมล */}
      <TextInput
        placeholder="อีเมล"
        value={email}
        onChangeText={setEmail}
        style={input}
      />

      {/* ช่องกรอกรหัสผ่าน */}
      <TextInput
        placeholder="รหัสผ่าน"
        secureTextEntry   // ทำให้ข้อความแสดงเป็นจุด (เหมือนรหัสผ่าน)
        value={password}
        onChangeText={setPassword}
        style={input}
      />

      {/* ช่องกรอกยืนยันรหัสผ่าน */}
      <TextInput
        placeholder="ยืนยันรหัสผ่าน"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        style={input}
      />

      {/* ปุ่มลงทะเบียน */}
      <TouchableOpacity
        onPress={() => router.replace("home")} // เมื่อกดจะไปหน้า Home (แก้ path ตามที่ต้องการ)
        style={{
          backgroundColor: "#5a4c4c",
          padding: 12,
          borderRadius: 20,
          alignItems: "center",
          marginTop: 10,
        }}  
      >
        <Text style={{ color: "white" }}>ลงทะเบียน</Text>
      </TouchableOpacity>

      {/* ปุ่มกลับไปหน้า Login */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ color: "white", textAlign: "center", marginTop: 15 }}>
          กลับไปหน้า Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// สไตล์สำหรับช่องกรอกข้อมูล
const input = {
  backgroundColor: "white",
  borderRadius: 20,
  padding: 12,
  marginBottom: 10,
};