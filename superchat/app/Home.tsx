import React, { useState } from "react";
import { View, Text, TextInput, FlatList, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const users = [
  { id: "1", name: "Kookie", age: 21, img: "https://i.imgur.com/0y8Ftya.jpg", tag: "Cute" },
  { id: "2", name: "V", age: 23, img: "https://i.imgur.com/uZ2pZ9A.jpg", tag: "Love" },
  { id: "3", name: "Jimin", age: 22, img: "https://i.imgur.com/l49aYS3.jpg", tag: "Cute" },
  { id: "4", name: "JK", age: 24, img: "https://i.imgur.com/GVJ8q6r.jpg", tag: "Love" },
];

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("All");

  // ฟังก์ชันกรองข้อมูลตาม search และ tag
  const filteredUsers = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase());
    const matchTag = filterTag === "All" || u.tag === filterTag;
    return matchSearch && matchTag;
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#7b6b6b", padding: 15 }}>
      {/* ช่องค้นหา */}
      <TextInput
        placeholder="ค้นหา"
        value={search}
        onChangeText={setSearch}
        style={{
          backgroundColor: "#fff",
          borderRadius: 25,
          paddingHorizontal: 15,
          paddingVertical: 8,
          marginBottom: 10,
        }}
      />

      {/* ปุ่มแท็กกรอง */}
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        {["All", "Love", "Cute"].map((tag) => (
          <TouchableOpacity
            key={tag}
            onPress={() => setFilterTag(tag)}
            style={{
              backgroundColor: filterTag === tag ? "#2a8" : "#5a4c4c",
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 20,
              marginRight: 6,
            }}
          >
            <Text style={{ color: "white" }}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* แสดงรายการผู้ใช้ */}
      <FlatList
        data={filteredUsers}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/profile/${item.id}`)}
            style={{
              backgroundColor: "#4f4242",
              width: "48%",
              borderRadius: 20,
              padding: 10,
              marginBottom: 10,
            }}
          >
            <Image
              source={{ uri: item.img }}
              style={{ width: "100%", height: 160, borderRadius: 15 }}
            />
            <Text style={{ color: "white", marginTop: 5 }}>
              {item.name}, {item.age}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Bottom Navigation Bar */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          padding: 10,
          backgroundColor: "#5a4c4c",
          borderRadius: 30,
        }}
      >
        <TouchableOpacity onPress={() => router.replace("home")} style={{ padding: 8 }}>
          <Text style={{ color: "white", fontSize: 18 }}>🏠</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("favorites")} style={{ padding: 8 }}>
          <Text style={{ color: "white", fontSize: 18 }}>❤️</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("chat")} style={{ padding: 8 }}>
          <Text style={{ color: "white", fontSize: 18 }}>💬</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("profile")} style={{ padding: 8 }}>
          <Text style={{ color: "white", fontSize: 18 }}>👤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}