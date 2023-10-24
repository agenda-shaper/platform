import React, { useEffect, useState, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Markdown from "@valasolutions/react-native-markdown";
import { SvgUri } from "react-native-svg"; // Import SvgUri
import utils, { InteractionManager } from "./utils"; // Import your utility module
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { sendMessage } from "./chatbot"; // Import the chatbot function
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

const interactionManager = InteractionManager.getInstance();

const ChatScreen = () => {
  const [isAtBottom, setIsAtBottom] = useState(true); // Add this state

  const flatListRef = useRef<FlatList>(null); // Add this ref

  const navigation = useNavigation();
  const [isSending, setIsSending] = useState(false); // Add this line

  const insets = useSafeAreaInsets();
  const [chatId, setChatId] = useState(null);

  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [inputMessage, setInputMessage] = useState<string>("");
  const newChat = async () => {
    // Clear the local state
    setMessages([]);
    const response = await utils.get("/chat/new");
    if (response.ok) {
      console.log("Started new chat");
      const data = await response.json();
      setChatId(data.chat_id); // Store the chat_id in state
    } else {
      console.log((await response.json()).message);
    }
  };
  const loadLastChat = async () => {
    // Clear the local state
    setMessages([]);
    const response = await utils.get("/chat/last");
    if (response.ok) {
      console.log("Loaded chat");
      const data = await response.json();
      setChatId(data.chat_id); // Store the chat_id in state
      setMessages(data.chat_history);
    } else {
      console.log((await response.json()).message);
    }
  };
  const handleMessageSend = async () => {
    if (inputMessage.trim() === "" || isSending) return; // Don't send empty messages or if already sending
    const message = inputMessage;
    setInputMessage("");
    let newMessages = [
      ...messages,
      {
        role: "user",
        content: message,
      },
      {
        // temp message
        role: "assistant",
        content: "...",
      },
    ];
    setMessages(newMessages);
    setIsSending(true); // Set isSending to true when sending a message

    const aiRespondedMessages = await sendMessage(newMessages);
    if (aiRespondedMessages) {
      setMessages(aiRespondedMessages);

      const lastTwoMessages = aiRespondedMessages.slice(-2);
      // Send the last two messages one by one, including the chat_id
      for (const message of lastTwoMessages) {
        const response = await utils.post("/chat/send", {
          chat_id: chatId, // Include the chat_id
          message: message,
        });
        if (response.ok) {
          console.log("Saving successful");
        } else {
          console.log((await response.json()).message);
        }
      }
    } else {
      // err
      newMessages.pop();
      newMessages.pop();
      setMessages([...newMessages]);
      // rollback input
      setInputMessage(message);
    }

    setIsSending(false); // Set isSending back to false after message is sent
  };
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        if (isAtBottom) {
          setTimeout(() => {
            if (flatListRef.current) {
              console.log("scrolling to end");
              flatListRef.current.scrollToEnd({ animated: true });
            }
          }, 10);
        }
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);
  useEffect(() => {
    loadLastChat();
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={newChat} style={{ paddingLeft: 16 }}>
          <Text style={{ fontSize: 12, color: "#000" }}>New</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]); // Empty dependency array ensures this runs only on mount
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={insets.top + 45} // Adjust this value as needed
    >
      <FlatList
        keyboardShouldPersistTaps="handled" // close keyboard on tap - leave on scroll
        ref={flatListRef}
        windowSize={10} // performance
        onScroll={({ nativeEvent }) => {
          const threshold = 10; // Adjust this value as needed
          setIsAtBottom(
            nativeEvent.contentOffset.y +
              nativeEvent.layoutMeasurement.height +
              threshold >=
              nativeEvent.contentSize.height
          );
        }}
        scrollEventThrottle={100}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View
            onLayout={() => {
              // Scroll to end if this is a new message and user is at bottom
              //console.log(isAtBottom);
              if (isAtBottom) {
                setTimeout(() => {
                  if (flatListRef.current) {
                    console.log("scrolling to end");
                    flatListRef.current.scrollToEnd({ animated: true });
                  }
                }, 10);
              }
            }}
            style={item.role === "user" ? styles.userMessage : styles.aiMessage}
          >
            <Text style={styles.text}>{item.content}</Text>
            {/* removed markdown */}
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Message"
          value={inputMessage}
          onChangeText={(text) => setInputMessage(text)}
          multiline // This makes the TextInput multiline
        />
        <TouchableOpacity onPress={handleMessageSend} disabled={isSending}>
          <SvgUri
            width="26"
            height="26"
            uri={`${utils.API_BASE_URL}/assets/chat-send.svg`}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
const customMarkdownStyles = {
  // Text
  text: {
    fontSize: 18,
  },

  // Headings
  heading1: {
    flexDirection: "row",
    fontSize: 32,
  },
  heading2: {
    flexDirection: "row",
    fontSize: 26,
  },
  heading3: {
    flexDirection: "row",
    fontSize: 22,
  },
  heading4: {
    flexDirection: "row",
    fontSize: 20,
  },
  heading5: {
    flexDirection: "row",
    fontSize: 18,
  },
  heading6: {
    flexDirection: "row",
    fontSize: 16,
  },

  // Lists
  bullet_list_icon: {
    marginLeft: 10,
    marginRight: 10,
    fontSize: 18,
  },

  // Code
  code_inline: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 4,
    fontSize: 18, // adjust this value as needed
    ...Platform.select({
      ["ios"]: {
        fontFamily: "Courier",
      },
      ["android"]: {
        fontFamily: "monospace",
      },
    }),
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  text: {
    fontSize: 18,
  },
  userMessage: {
    fontSize: 18, // adjust this value as needed
    alignSelf: "flex-end",
    backgroundColor: "#e3f2fd",
    padding: 8,
    marginVertical: 8,
    marginRight: 8,
    marginLeft: 64, // Adjust this to control message width
    borderRadius: 8,
  },
  aiMessage: {
    fontSize: 18, // adjust this value as needed
    alignSelf: "flex-start",
    backgroundColor: "#fde3fd",
    padding: 8,
    marginVertical: 4,
    marginLeft: 8,
    marginRight: 64, // Adjust this to control message width
    borderRadius: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    fontSize: 18, // adjust this value as needed
    flex: 1,
    marginRight: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 16,
    padding: 8,
    maxHeight: 100, // Set your desired max height here
  },
});

export default ChatScreen;
