// app/_layout.tsx
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";

function Gate({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();


  useEffect(() => {
    if (loading) return;

    const atAuth = segments[0] === "auth";
    const atChooseRole = atAuth && segments[1] === "choose-role";

    if (!user && !atAuth) {
      router.replace("/auth/login");
      return;
    }
    if (user && !role && !atChooseRole) {
      router.replace("/auth/choose-role");
      return;
    }
    if (user && role && atAuth) {
      router.replace(role === "parent" ? "/(parent)/dashboard" : "/(tabs)");
    }
  }, [loading, user, role, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  return <>{children}</>;
}

export default function Root() {
  return (
    <AuthProvider>
      <Gate>
        <Stack screenOptions={{ headerShown: false }} />
      </Gate>
    </AuthProvider>
  );
}
