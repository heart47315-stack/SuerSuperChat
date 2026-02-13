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
import { View, Text, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
export default function Home() {
  const router = useRouter();   
    const tags = ["แนะนำ", "ใกล้ฉัน", "ใหม่", "ยอดนิยม", "ออนไลน์"];
    const users = [
      {
        id: "1",
        name: "Alice",
        age: 25,
        img: "https://randomuser.me/api/portraits/women/1.jpg",
      },
      {         
        id: "2",
        name: "Bob",
        age: 30,
        img: "https://randomuser.me/api/portraits/men/2.jpg",
      },
      {                 
        id: "3",    
        name: "Cathy",
        age: 22,
        img: "https://randomuser.me/api/portraits/women/3.jpg",
        },
        {
        id: "4",
        name: "David",
        age: 28,
        img: "https://randomuser.me/api/portraits/men/4.jpg",
      },
    ];
    return ( 
    <View
      style={{
        flex: 1,
        backgroundColor: "#7b6b6b",
        padding: 15,
      }}
    >   
        {/* Tags */}    
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
            {tags.map((tag) => (
            <View
                key={tag}
                style={{    
                backgroundColor: "#5a4c4c",
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 20,
                marginRight: 6,
                }}
            >
                <Text style={{ color: "white" }}>{tag}</Text>
            </View>
            ))}
        </View>
        {/* User List */}
        <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => ( 
            <View
                style={{
                backgroundColor: "#5a4c4c",
                borderRadius: 10,   
                padding: 10,
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "center",
                }}
            >
                <Image source={{ uri: item.img }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                <View style={{ marginLeft: 10 }}>
                <Text style={{ color: "white", fontSize: 16 }}>{item.name}, {item.age}</Text>
                </View> 


                