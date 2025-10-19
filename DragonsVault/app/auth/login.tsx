import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { Link, router } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const onLogin = async () => {
    try {
      setErr(null); setInfo(null);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/"); // index gate will route by role
    } catch (e: any) {
      setErr(e.message);
    }
  };

  const onReset = async () => {
    try {
      setErr(null);
      await sendPasswordResetEmail(auth, email.trim());
      setInfo("Reset link sent (check your email).");
    } catch (e:any) {
      setErr(e.message);
    }
  };

  return (
    <View style={{ flex:1, justifyContent:"center", padding:16, gap:12 }}>
      <Text style={{ fontSize:24, fontWeight:"700" }}>Sign in</Text>
      <TextInput placeholder="Email" autoCapitalize="none" keyboardType="email-address"
        value={email} onChangeText={setEmail} style={{ borderWidth:1, borderRadius:8, padding:12 }} />
      <TextInput placeholder="Password" secureTextEntry
        value={password} onChangeText={setPassword} style={{ borderWidth:1, borderRadius:8, padding:12 }} />
      <Button title="Log in" onPress={onLogin} />
      <Button title="Forgot password?" onPress={onReset} />
      <Link href="/auth/register">Create account</Link>
      {err ? <Text style={{ color:"crimson" }}>{err}</Text> : null}
      {info ? <Text style={{ color:"green" }}>{info}</Text> : null}
    </View>
  );
}
