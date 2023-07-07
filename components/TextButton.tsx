import { FC } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

interface ITextButton {
  loading?: boolean;
  disabled?: boolean;
  title?: string;
  align?: "right" | "center" | "left";
  onPress?: () => void;
}

const TextButton: FC<ITextButton> = ({
  loading = false,
  disabled = false,
  title = "Next",
  align = "right",
  onPress,
}) => {
  return (
    <>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Pressable disabled={disabled} onPress={onPress}>
          <Text
            style={[styles.text, styles[align], disabled && styles.disabled]}
          >
            {title}
          </Text>
        </Pressable>
      )}
    </>
  );
};

export default TextButton;

const styles = StyleSheet.create({
  text: {
    color: "#2196F3",
    fontSize: 16,
    fontWeight: "500",
    padding: 10,
  },
  right: {
    textAlign: "right",
  },
  center: {
    textAlign: "center",
  },
  left: {
    textAlign: "left",
  },
  disabled: {
    color: "#DDDDDD",
  },
});
