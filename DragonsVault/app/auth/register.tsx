import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { router, Link } from "expo-router";
import { auth } from "@/firebase/firebaseConfig";

import { ensureUserDoc } from "@/lib/firestoreUser";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onRegister = async () => {
    try {
      setErr(null);
      if (!email.trim() || !password) throw new Error("Enter email and password");
      if (password.length < 6) throw new Error("Password must be at least 6 characters");
      if (password !== confirm) throw new Error("Passwords do not match");

      setSubmitting(true);

      const res = await createUserWithEmailAndPassword(auth, email.trim(), password);

      await ensureUserDoc(res.user.uid);

      router.replace("/auth/choose-role");
    } catch (e: any) {
      setErr(e?.message ?? "Sign up failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Create account</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />
      <TextInput
        placeholder="Password (min 6 chars)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />
      <TextInput
        placeholder="Confirm password"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />

      <Button title={submitting ? "Signing up..." : "Sign up"} onPress={onRegister} disabled={submitting} />

      <Link href="/auth/login" style={{ marginTop: 8 }}>
        Already have an account? Log in
      </Link>

      {err ? <Text style={{ color: "crimson" }}>{err}</Text> : null}
    </View>
  );
}
