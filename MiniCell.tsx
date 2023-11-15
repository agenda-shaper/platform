import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import utils, { InteractionManager } from "./utils"; // Import your utility module
import { CellType } from "./Cell";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { UserStackNavigationProp } from "./navigationTypes";

const interactionManager = InteractionManager.getInstance();

const MiniCell: React.FC<CellType> = React.memo(({ cell, source }) => {
  const navigation = useNavigation<UserStackNavigationProp>();

  const { id, title, imageUrl } = cell;
  const handlePress = () => {
    const source = "saved_posts";
    navigation.navigate("InnerCell", { cell, source });
    interactionManager.add({
      post_id: id,
      type: "post_click",
      data: { source: source },
    });
  };
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      style={styles.container}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
        {source && <Text style={styles.contextText}>Context</Text>}
      </View>

      <Image source={{ uri: imageUrl }} style={styles.image} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  contextText: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: "normal",
    color: "gray",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
});

export default MiniCell;
