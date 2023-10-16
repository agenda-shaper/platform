import React, { useEffect, useState, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  ViewToken,
} from "react-native";
import Cell, { CellProps } from "./Cell"; // Import your Cell component
import utils from "./utils"; // Import your utility module

interface VisibleItem {
  id: number;
  viewablePercent: number;
}

const MainScreen = () => {
  const [data, setData] = useState<CellProps[]>([]);
  const [visiblePosts, setVisiblePosts] = useState<VisibleItem[]>([]);

  const onViewableItemsChanged = useRef(
    (info: { viewableItems: ViewToken[] }) => {
      const windowHeight = Dimensions.get("window").height;
      console.log(windowHeight);

      const visiblePosts = info.viewableItems
        .filter((item) => item.item !== undefined)
        .map((item) => {
          const visibility = (item.item!.rect.height / windowHeight) * 100;
          return {
            id: (item.item as CellProps).id,
            viewablePercent: visibility,
          };
        });

      setVisiblePosts(visiblePosts);
    }
  );

  // Fetch data from your API here
  const fetchData = async () => {
    try {
      console.log("fetching recommended");
      const response = await utils.get("/cells/fetch"); // Replace with your actual API endpoint
      const result = await response.json();
      //console.log(result);

      const { cells } = result;
      setData(cells);

      // Start the interval after data is fetched
      startInterval();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const startInterval = () => {
    setInterval(() => {
      visiblePosts.forEach((post) => {
        console.log(
          `Post with id ${post.id} is ${post.viewablePercent}% visible.`
        );
        // Perform your calculations or operations here
      });
    }, 1000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Cell
            id={item.id} // Pass the "id" as a prop
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
            full_explanation={item.full_explanation}
          />
        )}
        keyExtractor={(item) => item.id.toString()} // Use the "id" as the key
        contentContainerStyle={styles.list}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50, // Adjust as needed
        }}
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
