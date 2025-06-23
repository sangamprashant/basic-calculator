
import { evaluate } from "mathjs";
import { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const buttons = [
  ["AC", "+/-", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "⌫", "="],
];

export default function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [justCalculated, setJustCalculated] = useState(false);

  const getButtonColor = (label: string) => {
    if (["AC", "+/-", "%"].includes(label)) return "bg-slate-500";
    if (["÷", "×", "-", "+", "="].includes(label)) return "bg-blue-600";
    return "bg-neutral-800";
  };

  const handlePress = (label: string) => {
    if (label === "AC") {
      setInput("");
      setResult("");
      setShowResult(false);
      setJustCalculated(false);
    } else if (label === "=") {
      try {
        const expression = input.replace(/×/g, "*").replace(/÷/g, "/");
        const evalResult = evaluate(expression);
        setResult(evalResult.toString());
        setShowResult(true);
        setJustCalculated(true);
      } catch {
        setResult("Error");
        setShowResult(true);
        setJustCalculated(true);
      }
    } else if (label === "⌫") {
      setInput((prev) => prev.slice(0, -1));
      setShowResult(false);
      setJustCalculated(false);
    } else if (label === "+/-") {
      setInput((prev) => (prev.startsWith("-") ? prev.slice(1) : "-" + prev));
      setShowResult(false);
      setJustCalculated(false);
    } else {
      if (justCalculated && /[0-9.]/.test(label)) {
        setInput(label);
      } else if (justCalculated && /[÷×\-+]/.test(label)) {
        setInput(result + label);
      } else {
        setInput((prev) => prev + label);
      }

      setShowResult(false);
      setJustCalculated(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Current Input */}
      <View className="px-5 pt-1 mt-10">
        <Text className="text-right text-xl text-blue-400">{input}</Text>
      </View>

      {/* Top Result Display */}
      {showResult && (
        <View className="px-5 pt-2">
          <Text className="text-right text-6xl text-gray-400">
            {result}
          </Text>
        </View>
      )}

      {/* Buttons */}
      <View className="flex-1 mt-4 px-4 justify-end pb-8">
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-between mb-3">
            {row.map((label) => (
              <TouchableOpacity
                key={label}
                onPress={() => handlePress(label)}
                className={`rounded-full w-[70px] h-[70px] justify-center items-center ${getButtonColor(label)}`}
              >
                <Text className="text-2xl font-semibold text-white">
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}
