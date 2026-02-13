import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#7b6b6b",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 24, color: "white", textAlign: "center", marginBottom: 20 }}>
        ลงทะเบียน
      </Text>

      {/* Name */}
      <TextInput
        placeholder="ชื่อ"
        value={name}
        onChangeText={setName}
        style={input}
      />

      {/* Email */}
      <TextInput
        placeholder="อีเมล"
        value={email}
        onChangeText={setEmail}
        style={input}
      />

      {/* Password */}
      <TextInput
        placeholder="รหัสผ่าน"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={input}
      />

      {/* Confirm */}
      <TextInput
        placeholder="ยืนยันรหัสผ่าน"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        style={input}
      />

      <TouchableOpacity
        onPress={() => router.replace("/login")}
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

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ color: "white", textAlign: "center", marginTop: 15 }}>
          กลับไปหน้า Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const input = {
  backgroundColor: "white",
  borderRadius: 20,
  padding: 12,
  marginBottom: 10,
};