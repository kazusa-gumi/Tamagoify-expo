import { Image, StyleSheet, Platform } from "react-native";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button, YStack } from "tamagui";
import { ThemedView } from "@/components/ThemedView";

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
            parts: [{ text: "短い励ましの言葉をください。" }],
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
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{encouragement}</ThemedText>
        <HelloWave />
      </ThemedView>
      <YStack padding="$10">
        <Button size="$6">kazusaaaaa-Button</Button>
      </YStack>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
          to see changes. Press{" "}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: "cmd + d",
              android: "cmd + m",
              web: "F12",
            })}
          </ThemedText>{" "}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this
          starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{" "}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText>{" "}
          to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
          directory. This will move the current{" "}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
