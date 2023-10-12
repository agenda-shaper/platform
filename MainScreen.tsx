import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import Cell, { CellProps } from "./Cell"; // Import your Cell component
import utils from "./utils"; // Import your utility module

const MainScreen = () => {
  const [data, setData] = useState<CellProps[]>([]);
  // Fetch data from your API here
  const fetchData = async () => {
    try {
      const response = await utils.get("/cells/fetch"); // Replace with your actual API endpoint
      const result = await response.json();
      console.log(result);

      const { cells } = result;
      setData(cells);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
