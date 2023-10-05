import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Markdown from "@valasolutions/react-native-markdown";
import utils from "./utils"; // Import your utils module
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { sendMessageToAI } from "./chatbot"; // Import the chatbot function

interface Message {
  role: string;
  content: string;
}

const ChatScreen = () => {
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [inputMessage, setInputMessage] = useState<string>("");

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
    const aiRespondedMessages = await sendMessageToAI(newMessages);
    if (aiRespondedMessages) {
      setMessages(aiRespondedMessages);
      const lastTwoMessages = aiRespondedMessages.slice(-2);
      const response = await utils.post("/chat/send", {
        messageFields: lastTwoMessages,
      });
      if (response.ok) {
        console.log("Saving successful");
      } else {
        console.log((await response.json()).message);
      }
    } else {
      // err
      newMessages.pop();
      newMessages.pop();
      setMessages([...newMessages]);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      //keyboardVerticalOffset={64}
      keyboardVerticalOffset={insets.top + 45} // Adjust this value as needed
    >
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View
            style={item.role === "user" ? styles.userMessage : styles.aiMessage}
          >
            <Markdown>{item.content}</Markdown>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputMessage}
          onChangeText={(text) => setInputMessage(text)}
        />
        <Button title="Send" onPress={handleMessageSend} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#e3f2fd",
    padding: 8,
    marginVertical: 4,
    marginRight: 8,
    marginLeft: 64, // Adjust this to control message width
    borderRadius: 8,
  },
  aiMessage: {
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
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    marginRight: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 16,
    padding: 8,
  },
});

export default ChatScreen;
