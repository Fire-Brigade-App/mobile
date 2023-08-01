import {
  FlatList,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import React, { FC } from "react";

interface Item {
  label: string;
  value: string | number;
}

interface IGroup {
  items: Item[];
  value?: string | number;
  style?: StyleProp<ViewStyle>;
  onChange: (value: string | number) => void;
}

const Group: FC<IGroup> = ({ style, items, value, onChange }) => {
  return (
    <FlatList
      style={[styles.group, style]}
      data={items}
      renderItem={({ item, index }) => (
        <Pressable
          style={[
            styles.item,
            value === item.value && styles.itemSelected,
            index === 0 && styles.itemFirst,
            index === items.length - 1 && styles.itemLast,
          ]}
          onPress={() => onChange(item.value)}
        >
          <Text>{item.label}</Text>
        </Pressable>
      )}
    />
  );
};

export default Group;

const styles = StyleSheet.create({
  group: {
    flexGrow: 0,
  },
  item: {
    paddingVertical: 10,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#cccccc",
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  itemSelected: {
    backgroundColor: "#cccccc",
  },
  itemFirst: {
    borderTopWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  itemLast: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});
