import React, { useEffect, useRef } from "react";
import { ScrollView, View, Text, Image, StyleSheet } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { MainStackParamList } from "./navigationTypes";
import { InteractionManager } from "./utils";

// Define a new type for your route prop
type InnerCellRouteProp = RouteProp<MainStackParamList, "InnerCell">;

// Add the new route prop to your component props
type Props = {
  route: InnerCellRouteProp;
};

const InnerCell: React.FC<Props> = ({ route }) => {
  const { title, description, imageUrl, id, full_explanation } = route.params;
  const navigation = useNavigation();
  const interactionManager = InteractionManager.getInstance();
  const startTimeRef = useRef<number | null>(null);
  useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      // Start the timer when the page comes into focus
      startTimeRef.current = Date.now();
      console.log("went active on inner cell");
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {
      // Stop the timer and log the time spent on the page when it goes out of focus
      if (startTimeRef.current) {
        const timeSpent = Date.now() - startTimeRef.current;
        interactionManager.add({
          id,
          type: "innercell_visibility",
          data: { visible_ms: timeSpent },
        });
        console.log(`User spent ${timeSpent} ms on inner cell ${id}`);
      }
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
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
  fullExplanation: {
    fontSize: 15,
    textAlign: "left",
  },
});

export default InnerCell;
