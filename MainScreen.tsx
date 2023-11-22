import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  ViewToken,
} from "react-native";
import Cell, { CellProps } from "./Cell"; // Import your Cell component
import utils, { InteractionManager } from "./utils"; // Import your utility module
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { MainStackNavigationProp } from "./navigationTypes";
import { SwipeListView } from "react-native-swipe-list-view";

const interactionManager = InteractionManager.getInstance();

const MainScreen = () => {
  // Inside your component
  const navigation = useNavigation<MainStackNavigationProp>();

  const timerId = useRef<number | null>(null);
  const [timeForInactivityInSecond, setTimeForInactivityInSecond] =
    useState(20);
  const [data, setData] = useState<CellProps[]>([]);
  const [wasIdle, setWasIdle] = useState(false); // Add this state
  const timers = useRef<{ [id: string]: number }>({});
  const [visiblePosts, setVisiblePosts] = useState<ViewToken[]>([]);
  const [listData, setListData] = React.useState(data); // Add this line

  const onSwipeValueChange = (swipeData: any) => {
    const { key, value } = swipeData;
    console.log(swipeData);
    if (value < -200) {
      console.log("deleting", key);
      // // If the user has swiped the list item to left beyond 200
      // const newData = [...listData]; // clone the list data
      // const prevIndex = listData.findIndex(item => item.id.toString() === key);
      // newData.splice(prevIndex, 1); // remove the item from the data array
      // setListData(newData); // update the state
    }
  };

  const onViewableItemsChanged = useCallback(
    (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      const visiblePosts = info.viewableItems
        .filter((item) => item.item !== undefined)
        .map((item) => {
          return item;
        });
      setVisiblePosts(visiblePosts);

      // Start a timer for each new visible post
      info.changed.forEach((change) => {
        if (change.isViewable && !timers.current[change.item.id]) {
          timers.current[change.item.id] = Date.now();
        } else if (!change.isViewable && timers.current[change.item.id]) {
          const visibleTime = Date.now() - timers.current[change.item.id];
          interactionManager.add({
            post_id: change.item.id,
            type: "post_visibility",
            data: { visible_ms: visibleTime },
          });

          console.log(
            `Post ${change.item.id} was visible for ${visibleTime} ms`
          );
          delete timers.current[change.item.id];
        }
      });
    },
    [interactionManager]
  );
  const onIdle = () => {
    console.log("went idle on main");
    // End all timers and log the visible times
    for (let id in timers.current) {
      if (timers.current[id]) {
        const visibleTime = Date.now() - timers.current[id];
        interactionManager.add({
          post_id: id,
          type: "post_visibility",
          data: { visible_ms: visibleTime },
        });
        console.log(`Post ${id} was visible for ${visibleTime} ms`);
        delete timers.current[id];
      }
    }
    setWasIdle(true); // Set the flag when user becomes idle
  };
  const onActive = () => {
    console.log("went active on main");

    // Start new timers for all currently visible posts
    for (let post of visiblePosts) {
      if (post.item && post.item.id && !timers.current[post.item.id]) {
        timers.current[post.item.id] = Date.now();
      }
    }
    setWasIdle(false); // Set the flag when user becomes idle
    resetInactivityTimeout();
  };

  // Fetch data from your API here
  const fetchCells = async () => {
    try {
      console.log("fetching recommended");
      const response = await utils.get("/cells/fetch"); // Replace with your actual API endpoint
      const result = await response.json();
      //console.log(result);

      const { cells } = result;
      setData(cells);
      resetInactivityTimeout();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const resetInactivityTimeout = () => {
    if (timerId.current) clearTimeout(timerId.current);
    timerId.current = window.setTimeout(() => {
      if (!wasIdle) {
        onIdle(); // Call onIdle when user is idle
      }
    }, timeForInactivityInSecond * 1000);
  };

  React.useEffect(() => {
    const unsubscribeBlur = navigation.addListener("blur", () => {
      onIdle();
    });

    const unsubscribeFocus = navigation.addListener("focus", () => {
      onActive();
    });
    fetchCells();

    return () => {
      unsubscribeBlur();
      unsubscribeFocus();
      // Clean up any remaining timers
      if (timerId.current) clearTimeout(timerId.current);
      for (let id in timers.current) {
        if (timers.current[id]) clearTimeout(timers.current[id]);
      }
    };
  }, []);
  const renderItem = ({ item }: { item: CellProps }) => <Cell cell={item} />;

  const renderHiddenItem = () => (
    <View style={[styles.rowBack]}>
      <Text>Ask AI</Text>
      <Text>See Less</Text>
    </View>
  );

  return (
    <View
      style={styles.container}
      onTouchStart={() => {
        if (wasIdle) {
          onActive(); // Call onActive when user becomes active after being idle
        }
      }}
    >
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        //renderHiddenItem={renderHiddenItem}
        initialNumToRender={10} // Render only the first 10 items initially
        //onRowDidOpen={onSwipeValueChange} // Add this line

        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 20,
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
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
});

export default MainScreen;
