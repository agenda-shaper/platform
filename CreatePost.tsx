// CreatePost.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import utils, { InteractionManager, uploadImage } from "./utils"; // Import your utility module
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
const CreatePost: React.FC = () => {
  const navigation = useNavigation();

  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [explanation, setExplanation] = useState("");
  const [links, setLinks] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreatePost = async () => {
    let img_url = null;
    if (image) {
      img_url = await uploadImage(image);
    }
    if (title && description && explanation) {
      if (title.length < 3 || title.length > 100) {
        console.error("Title must be between 3 and 100 characters long");
      }
      if (description.length < 20 || description.length > 500) {
        console.error("Description must be between 20 and 500 characters long");
      }
      const payload = {
        title,
        description,
        imageUrl: img_url,
        full_explanation: explanation,
        links: links,
      };
      const res = await utils.post("/cells/create", payload);
      if (res.status != 200) {
        const data = await res.json();
        console.error(data);
      } else {
        console.log("success cell creation");
        navigation.goBack();
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss}> */}
      <View style={styles.container}>
        <View style={styles.content}>
          <TextInput
            style={[styles.title, { maxHeight: 70 }]}
            onChangeText={setTitle}
            value={title}
            placeholder="Title"
            numberOfLines={3}
            multiline
            maxLength={100}
          />
          <TextInput
            style={[styles.description, { maxHeight: 140 }]}
            onChangeText={setDescription}
            value={description}
            placeholder="Description"
            numberOfLines={8}
            multiline
            maxLength={500}
          />
        </View>
        <View style={styles.imageAndButtonsContainer}>
          <TouchableOpacity onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Image
                source={{
                  uri: `${utils.API_BASE_URL}/assets/placeholder-img.png`,
                }}
                style={styles.image}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.explanationContainer}>
        <TextInput
          style={[styles.input, { maxHeight: 140 }]}
          onChangeText={setExplanation}
          value={explanation}
          placeholder="Full Explanation"
          scrollEnabled={true}
          multiline
          maxLength={10000}
          //editable // Ensure the TextInput is editable
        />

        <TouchableOpacity onPress={handleCreatePost}>
          <Text style={styles.createButton}>Create</Text>
        </TouchableOpacity>
      </View>
      {/* </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    minHeight: 260,
    maxHeight: 300,
    backgroundColor: "white",
  },
  content: {
    flex: 2,
  },
  createButton: {
    fontSize: 18,
    color: "black", // changing color to black
    borderWidth: 1, // adding an outline
    borderRadius: 8, // smoothing corners
    borderColor: "black", // setting the border color to black
    paddingHorizontal: 12, // optional padding for better appearance
    paddingVertical: 6, // optional padding for better appearance
    marginBottom: 8, // optional margin for spacing
    textAlign: "center", // center the text inside the button
    alignSelf: "center",
  },
  title: {
    fontSize: 18,
    paddingRight: 20,
    paddingLeft: 8,
    fontWeight: "bold",
    textAlign: "left", // This will center the text
    marginBottom: 8,
  },
  description: {
    paddingLeft: 8,
    paddingRight: 20,
    textAlign: "left", // This will center the text
    fontSize: 16,
    color: "#888",
  },
  image: {
    aspectRatio: 1,
    borderRadius: 8,
    marginVertical: 8,
    height: 120,
  },
  imageAndButtonsContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  explanationContainer: {
    padding: 16,
  },
  input: {
    width: "100%",
    margin: 12,
    padding: 10,
  },
});

export default CreatePost;
