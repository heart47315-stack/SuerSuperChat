import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* หัวข้อหลักของหน้า */}
      <Text style={styles.title}>ยินดีต้อนรับสู่แอปของคุณ</Text>
      <Text style={styles.subtitle}>
        หน้านี้คือหน้าแรก (index.tsx) ของแอป
      </Text>

      {/* ปุ่มนำทางไปหน้าอื่น เช่น Home, Login, Register */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/home")}
      >
        <Text style={styles.buttonText}>ไปที่หน้า Home 🏠</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>เข้าสู่ระบบ 🔑</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/register")}
      >
        <Text style={styles.buttonText}>สมัครสมาชิก 📝</Text>
      </TouchableOpacity>
    </View>
  );
}

// สไตล์สำหรับหน้า index
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7b6b6b",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "white",
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#5a4c4c",
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});