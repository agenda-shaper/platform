import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import utils from "./utils"; // Import your utility module
import { SvgUri } from "react-native-svg"; // Import SvgUri
import LikePressedIcon from "./assets/like-pressed.svg";
import DislikePressedIcon from "./assets/dislike-pressed.svg";
import LikeUnpressedIcon from "./assets/like-unpressed.svg";
import DislikeUnpressedIcon from "./assets/dislike-unpressed.svg";
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
      </View>
      <View style={styles.imageAndButtonsContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.buttonContainer, liked && styles.likedButton]}
            onPress={handleLikePress}
          >
            <SvgUri width="50" height="50" uri={LikeUnpressedIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonContainer, disliked && styles.dislikedButton]}
            onPress={handleDislikePress}
          >
            <SvgUri width="50" height="50" uri={DislikeUnpressedIcon} />
          </TouchableOpacity>
        </View>
      </View>
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
    justifyContent: "space-between", // Change this to 'space-between' to distribute the buttons evenly
    marginTop: 8,
    width: "85%", // Reduce this to make the buttons smaller
  },
  buttonContainer: {
    flex: 1, // Add this to make the TouchableOpacity elements take up full space
    alignItems: "center", // Center the text horizontally
    justifyContent: "center", // Center the text vertically
    aspectRatio: 1, // Add this to make the buttons square
    margin: 3,
  },
  button: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center", // Center the text inside the button
  },
  likedButton: {
    borderRadius: 15,
    backgroundColor: "green",
    color: "white",
  },
  dislikedButton: {
    borderRadius: 15,
    backgroundColor: "red",
    color: "white",
  },
  imageAndButtonsContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center", // Add this to align the image and buttons
  },
});

export default Cell;
