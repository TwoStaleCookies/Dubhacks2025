import { Redirect } from "expo-router";

export default function IndexGate() {
  let role = "kid"; 

  return role === "parent"
    ? <Redirect href="/(parent)/dashboard" />
    : <Redirect href="/(tabs)" />; // or "/(tabs)/index"
}