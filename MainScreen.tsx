import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import Cell from "./Cell"; // Import your Cell component

const MainScreen = () => {
  // Sample data for the cells
  const data = [
    {
      id: "1",
      title: "Cell 1",
      description: "Description for Cell 1",
      imageUrl:
        "https://nationaltoday.com/wp-content/uploads/2022/10/456841065-min-1200x834.jpg",
    },
    {
      id: "2",
      title: "Cell 2",
      description: "Description for Cell 2",
      imageUrl:
        "https://nationaltoday.com/wp-content/uploads/2022/10/456841065-min-1200x834.jpg",
    },
    {
      id: "3",
      title: "Cell 3",
      description: "Description for Cell 3",
      imageUrl:
        "https://nationaltoday.com/wp-content/uploads/2022/10/456841065-min-1200x834.jpg",
    },
    {
      id: "4",
      title: "Cell 4",
      description: "Description for Cell 4",
      imageUrl:
        "https://nationaltoday.com/wp-content/uploads/2022/10/456841065-min-1200x834.jpg",
    },
    {
      id: "99",
      title: "Cell 99",
      description: "Description for Cell 99",
      imageUrl:
        "https://nationaltoday.com/wp-content/uploads/2022/10/456841065-min-1200x834.jpg",
    },
    {
      id: "6",
      title: "Cell 6",
      description: "Description for Cell 6",
      imageUrl:
        "https://nationaltoday.com/wp-content/uploads/2022/10/456841065-min-1200x834.jpg",
    },
    {
      id: "7",
      title: "Cell 7",
      description: "Description for Cell 7",
      imageUrl:
        "https://nationaltoday.com/wp-content/uploads/2022/10/456841065-min-1200x834.jpg",
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Cell
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingVertical: 16,
  },
});

export default MainScreen;
