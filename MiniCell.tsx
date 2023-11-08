import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import utils, { InteractionManager } from "./utils"; // Import your utility module
import { CellType } from "./Cell";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { UserStackNavigationProp } from "./navigationTypes";

const interactionManager = InteractionManager.getInstance();

const MiniCell: React.FC<CellType> = React.memo(({ cell }) => {
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
      <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
        {title}
      </Text>
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
  title: {
    flex: 1,
    fontSize: 16,
    padding: 8,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 8,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
});
export default MiniCell;
