import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    // ใช้ Stack Navigator จาก expo-router
    // เพื่อกำหนดเส้นทาง (routes) ของแอปทั้งหมด
    <Stack screenOptions={{ headerShown: false }}>
      
      {/* หน้าแรกของแอป */}
      <Stack.Screen name="index" />

      {/* หน้าเข้าสู่ระบบ */}
      <Stack.Screen name="login" />

      {/* หน้าสมัครสมาชิก */}
      <Stack.Screen name="register" />

      {/* หน้า Home หลังเข้าสู่ระบบ */}
      <Stack.Screen name="home" />

      {/* หน้า Login สำหรับ Admin */}
      <Stack.Screen name="admin-login" />

      {/* หน้า Home ของ Admin */}
      <Stack.Screen name="admin-home" />

      {/* หน้า Create Character สำหรับสร้างตัวละคร */}
      <Stack.Screen name="create-character" />

      {/* Dynamic route: หน้า Chat โดยใช้ id ของห้องแชท */}
      <Stack.Screen name="chat/[id]" />

      {/* Dynamic route: หน้า Character โดยใช้ id ของตัวละคร */}
      <Stack.Screen name="character/[id]" />
    </Stack>
  );
}