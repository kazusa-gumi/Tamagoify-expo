import { Image, StyleSheet, Platform, View } from "react-native";

import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  YStack,
  XStack,
  Card,
  Text,
  Theme,
  Circle,
  AnimatePresence,
  H2,
  useTheme,
} from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { Heart, MessageCircle, RefreshCw } from "@tamagui/lucide-icons";

const encouragementPrompts = [
  "今日一日を乗り切るための短い励ましの言葉をください。20文字以内で。",
  "友達を元気づける言葉を教えてください。20文字以内で。",
  "勉強や仕事で疲れた人向けの応援メッセージを20文字以内でください。",
  "落ち込んでいる人に送る前向きな言葉を20文字以内でください。",
  "今日のポジティブな一言を20文字以内でください。",
];

const randomPrompt =
  encouragementPrompts[Math.floor(Math.random() * encouragementPrompts.length)];

console.log(randomPrompt);

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
                text:
                  randomPrompt +
                  " アプリに表示できないので、あなたの返答１つだけをテキストだけで表示してください",
              },
            ],
          },
        ],
        generation_config: {
          temperature: 0.9,
          top_p: 0.8,
          top_k: 40,
        },
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
  const [mood, setMood] = useState("normal"); // normal, happy, excited
  const [happiness, setHappiness] = useState(70);
  const theme = useTheme();

  const getNewEncouragement = async () => {
    const text = await fetchEncouragement();
    if (text) {
      setEncouragement(text);
      setMood("happy");
      setHappiness((prev) => Math.min(prev + 10, 100));
      // 3秒後に通常の表情に戻す
      setTimeout(() => setMood("normal"), 3000);
    }
  };

  useEffect(() => {
    getNewEncouragement();
  }, []);

  return (
    <Theme name="pink">
      <YStack f={1} padding="$4" space>
        <YStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={-1}
        >
          <LinearGradient
            colors={["#f8bbd0", "#f48fb1"]}
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
          />
        </YStack>

        {/* ステータスバー */}
        <Card bordered elevate padding="$2" marginTop="$4">
          <XStack alignItems="center" space>
            <Heart color={happiness > 50 ? "$red10" : "$gray8"} size={18} />
            <Text fontSize="$3">きもち: {happiness}%</Text>
          </XStack>
        </Card>

        {/* キャラクターセクション */}
        <YStack flex={1} justifyContent="center" alignItems="center">
          <AnimatePresence>
            <Circle
              size={280}
              backgroundColor="#edb5d2"
              bordered
              borderColor="#c8a8da"
              shadowColor="#c8a8da"
              shadowRadius={5}
              shadowOffset={{ width: 0, height: 3 }}
              marginBottom={20}
            >
              <Image
                source={require("@/assets/images/neko.png")}
                style={{ width: 200, height: 120 }}
              />
            </Circle>
          </AnimatePresence>
          <Card
            marginTop="$2"
            padding="$4"
            bordered
            elevate
            backgroundColor="#ffffff20"
            borderColor="#ffffff20"
            borderRadius="$6"
          >
            <Text
              fontSize="$5"
              textAlign="center"
              fontWeight="bold"
              color="#ffffff"
            >
              {encouragement || "こんにちは！"}
            </Text>
          </Card>
        </YStack>
      </YStack>
    </Theme>
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
    color: "#ffffff",
    flexWrap: "wrap",
    maxWidth: 300,
  },
});
