// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity } from "react-native";
// import { useRouter } from "expo-router";

// export default function Login() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   return (
//     <View
//       style={{
//         flex: 1,
//         backgroundColor: "#7b6b6b",
//         justifyContent: "center",
//         alignItems: "center",
//         padding: 20,
//       }}
//     >
//       <Text style={{ fontSize: 24, color: "white", marginBottom: 20 }}>
//         เข้าสู่ระบบ
//       </Text>

//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         style={{
//           backgroundColor: "white",
//           width: "100%",
//           padding: 12,
//           borderRadius: 20,
//           marginBottom: 10,
//         }}
//       />

//       <TextInput
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//         style={{
//           backgroundColor: "white",
//           width: "100%",
//           padding: 12,
//           borderRadius: 20,
//           marginBottom: 15,
//         }}
//       />

//       <TouchableOpacity
//         onPress={() => router.replace("/home")}
//         style={{
//           backgroundColor: "#5a4c4c",
//           padding: 12,
//           borderRadius: 20,
//           width: "100%",
//           alignItems: "center",
//           marginBottom: 15,
//         }}
//       >
//         <Text style={{ color: "white" }}>เข้าสู่ระบบ</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => router.push("/register")}> 
//         <Text style={{ color: "white", marginTop: 10 }}>ลงทะเบียน</Text>
//       </TouchableOpacity>
//     </View>
//   );
// } 
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: "#7b6b6b", justifyContent: "center", padding: 20 }}>

      <Text style={{ color: "white", fontSize: 24, textAlign: "center", marginBottom: 20 }}>
        เข้าสู่ระบบ
      </Text>

      <TextInput placeholder="Email" onChangeText={setEmail} style={input} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} style={input} />

      {/* Login */}
      <TouchableOpacity style={button} onPress={() => router.replace("/home")}>
        <Text style={{ color: "white" }}>เข้าสู่ระบบ</Text>
      </TouchableOpacity>

      {/* Register */}
      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={{ color: "white", textAlign: "center", marginTop: 15 }}>
          ลงทะเบียน
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

const button = {
  backgroundColor: "#5a4c4c",
  padding: 12,
  borderRadius: 20,
  alignItems: "center",
};


                