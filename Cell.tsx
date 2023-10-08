import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import utils from "./utils"; // Import your utility module

// Define a TypeScript interface for the props
export interface CellProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

const Cell: React.FC<CellProps> = ({ title, description, imageUrl, id }) => {
  const [liked, setLiked] = useState<boolean>(false);
  const [disliked, setDisliked] = useState<boolean>(false);
  const react = async (reactionType: string) => {
    try {
      console.log(id, reactionType);
      const response = await utils.post("/cells/react", {
        post_id: id,
        reactionType: reactionType,
      }); // Replace with your actual API endpoint
      const data = await response.json();
      console.log(data);
      const { isLiked, isDisliked } = data;
      setLiked(isLiked);
      setDisliked(isDisliked);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLikePress = async () => {
    if (!liked) {
      console.log("Liked:", title);
      await react("like");
    } else {
      console.log("Unliked:", title);
      await react("unlike");
    }
  };

  const handleDislikePress = async () => {
    if (!disliked) {
      console.log("Disliked:", title);
      await react("dislike");
    } else {
      console.log("Undisliked:", title);
      await react("undislike");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={handleLikePress}>
            <Text style={[styles.button, liked && styles.likedButton]}>
              Like
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDislikePress}>
            <Text style={[styles.button, disliked && styles.dislikedButton]}>
              Dislike
            </Text>
          </TouchableOpacity>
        </View>
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
    height: 200,
  },
  content: {
    flex: 2,
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
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    padding: 8,
    fontSize: 16,
    fontWeight: "bold",
    borderRadius: 8,
  },
  likedButton: {
    backgroundColor: "green",
    color: "white",
  },
  dislikedButton: {
    backgroundColor: "red",
    color: "white",
  },
});

export default Cell;
