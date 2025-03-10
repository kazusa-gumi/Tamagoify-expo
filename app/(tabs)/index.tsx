import { Image, StyleSheet, Platform, View } from "react-native";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button, YStack } from "tamagui";
import { ThemedView } from "@/components/ThemedView";
import { Theme } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

export const fetchEncouragement = async () => {
  if (!process.env.EXPO_PUBLIC_API_KEY || !process.env.EXPO_PUBLIC_API_KEY) {
    console.error("APIキーが設定されていません。");
    return null;
  }
  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_GEMINI_API_URL}?key=${process.env.EXPO_PUBLIC_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: "アプリでユーザーに表示する励ましの言葉をください。20文字以内で。アプリに表示できないので、あなたの返答１つだけをテキストだけで表示してください",
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const encouragementText = response.data.candidates[0]?.content;
    if (!encouragementText) {
      console.error("Unexpected API response format:", response.data);
      return null;
    }
    return encouragementText.parts[0].text;
  } catch (error) {
    console.error("APIリクエストエラー:", error);
    return null;
  }
};

export default function HomeScreen() {
  const [encouragement, setEncouragement] = useState<string | undefined>("");

  useEffect(() => {
    const getEncouragement = async () => {
      const text = await fetchEncouragement();
      if (text) {
        setEncouragement(text);
      }
    };
    getEncouragement();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("@/assets/images/neko.png")}
          style={styles.reactLogo}
        />
        <ThemedText type="title" style={styles.encouragementText}>
          {encouragement}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ead2df",
  },
  content: {
    flexDirection: "column",
    alignItems: "center",
  },
  reactLogo: {
    height: 178,
    width: 290,
    marginBottom: 20,
  },
  encouragementText: {
    color: "#2c3e50", // ダークブルー
  },
});
