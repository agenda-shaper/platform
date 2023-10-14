import React from "react";
import { ScrollView, View, Text, Image, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { MainStackParamList } from "./navigationTypes";

// Define a new type for your route prop
type InnerCellRouteProp = RouteProp<MainStackParamList, "InnerCell">;

// Add the new route prop to your component props
type Props = {
  route: InnerCellRouteProp;
};

const InnerCell: React.FC<Props> = ({ route }) => {
  const { title, description, imageUrl, id, full_explanation } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.fullExplanation}>{full_explanation}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    resizeMode: "cover",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  fullExplanation: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default InnerCell;
