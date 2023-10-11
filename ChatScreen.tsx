import React, { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import KeyboardDismissView from "react-native-keyboard-dismiss-view";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import Markdown from "@valasolutions/react-native-markdown";
import { SvgUri } from "react-native-svg"; // Import SvgUri
import utils from "./utils"; // Import your utils module
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

interface Message {
  role: string;
  content: string;
}

const ChatScreen = () => {
  const [isScrolling, setIsScrolling] = useState(false);

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
  const handleMessageSend = async () => {
    if (inputMessage.trim() === "") return; // Don't send empty messages
    setInputMessage("");
    let newMessages = [
      ...messages,
      {
        role: "user",
        content: inputMessage,
      },
      {
        // temp message
        role: "assistant",
        content: "...",
      },
    ];
    setMessages(newMessages);
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
    }
  };
  useEffect(() => {
    newChat();
  }, []); // Empty dependency array ensures this runs only on mount

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={insets.top + 45} // Adjust this value as needed
    >
      <KeyboardDismissView style={{ flex: 1 }}>
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View
              style={
                item.role === "user" ? styles.userMessage : styles.aiMessage
              }
            >
              <Markdown style={customMarkdownStyles}>{item.content}</Markdown>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </KeyboardDismissView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Message"
          value={inputMessage}
          onChangeText={(text) => setInputMessage(text)}
          multiline // This makes the TextInput multiline
        />
        <TouchableOpacity onPress={handleMessageSend}>
          <SvgUri
            width="28"
            height="28"
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
