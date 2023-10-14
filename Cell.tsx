import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import utils from "./utils"; // Import your utility module
import { SvgUri } from "react-native-svg"; // Import SvgUri
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { MainStackNavigationProp } from "./navigationTypes";

// Define a TypeScript interface for the prop
export interface CellProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  full_explanation: string;
}

const Cell: React.FC<CellProps> = ({
  title,
  description,
  imageUrl,
  id,
  full_explanation,
}) => {
  const navigation = useNavigation<MainStackNavigationProp>();

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
      // const { isLiked, isDisliked } = data;
      // setLiked(isLiked);
      // setDisliked(isDisliked);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLikePress = async () => {
    if (!liked) {
      console.log("Liked:", title);
      setLiked(true);
      setDisliked(false);
      await react("like");
    } else {
      console.log("Unliked:", title);
      setLiked(false);
      await react("unlike");
    }
  };

  const handleDislikePress = async () => {
    if (!disliked) {
      console.log("Disliked:", title);
      setDisliked(true);
      setLiked(false);
      await react("dislike");
    } else {
      console.log("Undisliked:", title);
      setDisliked(false);
      await react("undislike");
    }
  };
  // Inside your Cell component
  const handlePress = () => {
    navigation.navigate("InnerCell", {
      title,
      description,
      imageUrl,
      id,
      full_explanation,
    });
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={3} ellipsizeMode="tail">
            {title}
          </Text>
          <Text
            style={styles.description}
            numberOfLines={5}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
        </View>
        <View style={styles.imageAndButtonsContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.buttonContainer]}
              onPress={handleLikePress}
            >
              {liked ? (
                <SvgUri
                  width="30"
                  height="30"
                  uri={`${utils.API_BASE_URL}/assets/like-pressed.svg`}
                />
              ) : (
                <SvgUri
                  width="30"
                  height="30"
                  uri={`${utils.API_BASE_URL}/assets/like-unpressed.svg`}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonContainer]}
              onPress={handleDislikePress}
            >
              {disliked ? (
                <SvgUri
                  width="30"
                  height="30"
                  uri={`${utils.API_BASE_URL}/assets/dislike-pressed.svg`}
                />
              ) : (
                <SvgUri
                  width="30"
                  height="30"
                  uri={`${utils.API_BASE_URL}/assets/dislike-unpressed.svg`}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingVertical: 16, // adjust this value to change the top and bottom spacing
    paddingHorizontal: 18, // adjust this value to change the left and right spacing
    borderBottomWidth: 1,
    borderColor: "#ccc",
    minHeight: 200,
    maxHeight: 250,
  },
  content: {
    flex: 2,
  },
  title: {
    fontSize: 18,
    paddingRight: 20,
    paddingLeft: 10,
    fontWeight: "bold",
    textAlign: "left", // This will center the text

    marginBottom: 8,
  },
  description: {
    paddingLeft: 10,
    paddingRight: 20,
    textAlign: "left", // This will center the text
    fontSize: 16,
    color: "#888",
  },
  image: {
    //flex: 0.8, // adjust this value to change the size of the image
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
    height: 100,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Change this to 'space-between' to distribute the buttons evenly
    marginTop: 8,
    marginBottom: 0,
    //flex: 0.8,
    width: "90%", // Reduce this to make the buttons smaller
  },
  buttonContainer: {
    flex: 2, // Add this to make the TouchableOpacity elements take up full space
    alignItems: "center", // Center the text horizontally
    justifyContent: "center", // Center the text vertically
    aspectRatio: 1, // Add this to make the buttons square
    margin: 3,
  },
  imageAndButtonsContainer: {
    flex: 0.8,
    justifyContent: "space-between",
    alignItems: "center", // Add this to align the image and buttons
  },
});

export default Cell;
