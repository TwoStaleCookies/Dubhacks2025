import React from "react";
import { View, Button, Text } from "react-native";
import { useAuth } from "@/providers/AuthProvider";
import { router } from "expo-router";

export default function ChooseRole() {
  const { setRole } = useAuth();
  const pick = async (r: "kid" | "parent") => { await setRole(r); 
    if (r === "parent") {
      router.replace("/(parent)/dashboard");
    } else {
      router.replace("/"); };
    }
    
  return (
    <View style={{ flex:1, justifyContent:"center", alignItems:"center", gap:16, padding:16 }}>
      <Text style={{ fontSize:24, fontWeight:"700" }}>Who are you?</Text>
      <Button title="I'm a Kid" onPress={() => pick("kid")} />
      <Button title="I'm a Parent" onPress={() => pick("parent")} />
    </View>
  );
}
