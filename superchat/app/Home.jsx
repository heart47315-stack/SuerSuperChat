import React from "react";
import { View, Text, TextInput, FlatList, Image } from "react-native";

const users = [
  { id: "1", name: "Kookie", age: 21, img: "https://i.imgur.com/0y8Ftya.jpg" },
  { id: "2", name: "V", age: 23, img: "https://i.imgur.com/uZ2pZ9A.jpg" },
  { id: "3", name: "Jimin", age: 22, img: "https://i.imgur.com/l49aYS3.jpg" },
  { id: "4", name: "JK", age: 24, img: "https://i.imgur.com/GVJ8q6r.jpg" },
];

export default function Home() {
  return (
    <View style={{ flex: 1, backgroundColor: "#7b6b6b", padding: 15 }}>
      <TextInput
        placeholder="ค้นหา"
        style={{ backgroundColor: "#fff", borderRadius: 25, paddingHorizontal: 15, paddingVertical: 8, marginBottom: 10 }}
      />

      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        {["All", "Love", "Cute"].map((tag) => (
          <View key={tag} style={{ backgroundColor: "#5a4c4c", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginRight: 6 }}>
            <Text style={{ color: "white" }}>{tag}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={users}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: "#4f4242", width: "48%", borderRadius: 20, padding: 10, marginBottom: 10 }}>
            <Image source={{ uri: item.img }} style={{ width: "100%", height: 160, borderRadius: 15 }} />
            <Text style={{ color: "white", marginTop: 5 }}>{item.name}, {item.age}</Text>
          </View>
        )}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-around", padding: 10, backgroundColor: "#5a4c4c", borderRadius: 30 }}>
        <Text>🏠</Text>
        <Text>❤️</Text>
        <Text>💬</Text>
        <Text>👤</Text>
      </View>
    </View>
  );
}
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
        {/* Email */}
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
        {/* Password */}
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
        {/* Login Button */}
        <TouchableOpacity
        onPress={() => router.push("/home")}
        style={{    
            backgroundColor: "#5a4c4c",
            padding: 12,
            borderRadius: 20,   
            width: "100%",
            alignItems: "center",
            marginBottom: 10,
        }}
        >
        <Text style={{ color: "white", fontSize: 16 }}>เข้าสู่ระบบ</Text>
        </TouchableOpacity>
    </View>
    );
}
        <Text style={{ color: "white", fontSize: 16 }}>ลงทะเบียน</Text>
      </TouchableOpacity>
    </View>
  );
}
        </Text>
      </TouchableOpacity>
    </View> 

        {/* Google */}  
        <TouchableOpacity
        style={{
            backgroundColor: "#ddd",
            padding: 10,
            borderRadius: 20,
            width: "100%",
            alignItems: "center",
        }}
        >
        <Text style={{ color: "black" }}>เข้าสู่ระบบด้วย Google</Text>
        </TouchableOpacity>
    </View>
    );
}
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
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
        onPress={() => router.push("/home")}
        style={{
            backgroundColor: "#5a4c4c", 
            padding: 12,
            borderRadius: 20,
            width: "100%",
            alignItems: "center",   
            marginBottom: 10,
        }}
        >   
        <Text style={{ color: "white", fontSize: 16 }}>ลงทะเบียน</Text>
        </TouchableOpacity>
    </View>
  );
}
const input = {
  backgroundColor: "white",
  width: "100%",
  padding: 12,
  borderRadius: 20,
    marginBottom: 10,
};  
        <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ color: "white", textAlign: "center", marginTop: 15 }}>
          กลับไปหน้า Login
        </Text> 