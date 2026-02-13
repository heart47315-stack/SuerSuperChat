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
