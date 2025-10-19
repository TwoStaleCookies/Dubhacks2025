import { Redirect } from "expo-router";

export default function IndexGate() {
  const role: "parent" | "kid" = "parent"; // TODO: replace later
  return role === "parent" ? <Redirect href="/dashboard" /> : <Redirect href="/" />;
}