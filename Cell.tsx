import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import utils, { InteractionManager } from "./utils"; // Import your utility module
import { SvgUri } from "react-native-svg"; // Import SvgUri
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { MainStackNavigationProp } from "./navigationTypes";
import moment from "moment";

const interactionManager = InteractionManager.getInstance();

interface CellType {
  cell: CellProps;
}
// Define a TypeScript interface for the prop
export interface CellProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  full_explanation: string;
  links: any;
  created_at: any;
}

const Cell: React.FC<CellType> = React.memo(({ cell }) => {
  const {
    id,
    title,
    description,
    imageUrl,
    full_explanation,
    links,
    created_at,
  } = cell;

  const navigation = useNavigation<MainStackNavigationProp>();
  const [liked, setLiked] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const timeFromNow = (timestamp: any) => {
    return moment(timestamp).fromNow();
  };

  const handleLikePress = async () => {
    if (!liked) {
      interactionManager.add({
        id,
        type: "like",
        data: { reaction: "like" },
      });
      console.log("Liked:", title);
      setLiked(true);
    } else {
      interactionManager.add({
        id,
        type: "like",
        data: { reaction: "unlike" },
      });
      console.log("Unliked:", title);
      setLiked(false);
    }
  };

  const handleSavePress = async () => {
    if (!saved) {
      interactionManager.add({
        id,
        type: "save",
        data: { reaction: "save" },
      });
      console.log("Saved:", title);
      setSaved(true);
    } else {
      interactionManager.add({
        id,
        type: "save",
        data: { reaction: "unsave" },
      });
      console.log("Unsaved:", title);
      setSaved(false);
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
      links,
      created_at,
    });
    interactionManager.add({ id, type: "post_click" });
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
            numberOfLines={7}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
          <Text style={styles.timeAgo}>{timeFromNow(created_at)}</Text>
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
              onPress={handleSavePress}
            >
              {saved ? (
                <SvgUri
                  width="30"
                  height="30"
                  uri={`${utils.API_BASE_URL}/assets/save-pressed.svg`}
                />
              ) : (
                <SvgUri
                  width="30"
                  height="30"
                  uri={`${utils.API_BASE_URL}/assets/save-unpressed.svg`}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

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
    minHeight: 260,
    maxHeight: 280,
    backgroundColor: "white",
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
  timeAgo: {
    paddingLeft: 10,
    paddingTop: 18,
    color: "#888",
    fontSize: 12,
  },
});

export default Cell;
