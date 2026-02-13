import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#7b6b6b",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 24, color: "white", marginBottom: 20 }}>
        เข้าสู่ระบบ
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          backgroundColor: "white",
          width: "100%",
          padding: 12,
          borderRadius: 20,
          marginBottom: 10,
        }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          backgroundColor: "white",
          width: "100%",
          padding: 12,
          borderRadius: 20,
          marginBottom: 15,
        }}
      />

      <TouchableOpacity
        onPress={() => router.replace("/home")}
        style={{
          backgroundColor: "#5a4c4c",
          padding: 12,
          borderRadius: 20,
          width: "100%",
          alignItems: "center",
          marginBottom: 15,
        }}
      >
        <Text style={{ color: "white" }}>เข้าสู่ระบบ</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}> 
        <Text style={{ color: "white", marginTop: 10 }}>ลงทะเบียน</Text>
      </TouchableOpacity>
    </View>
  );
} 


                