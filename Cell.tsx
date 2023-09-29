import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

// Define a TypeScript interface for the props
export interface CellProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const Cell: React.FC<CellProps> = ({ title, description, imageUrl }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Image source={{ uri: imageUrl }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    height: 200, // Increase the height to make the cell taller
  },
  content: {
    flex: 2, // Takes up 2/3 of the available space
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    color: "#888",
  },
  image: {
    flex: 1, // Takes up 1/3 of the available space
    aspectRatio: 1, // Makes the image square
    borderRadius: 8,
  },
});

export default Cell;
