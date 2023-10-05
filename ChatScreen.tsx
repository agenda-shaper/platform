import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import { sendMessageToAcyToo } from "./chatbot"; // Import the chatbot function

const ChatScreen = () => {
  const [messages, setMessages] = useState<
    { role: string; content: string; createdAt: number }[]
  >([]);
  const [inputMessage, setInputMessage] = useState<string>("");

  const handleMessageSend = async () => {
    if (inputMessage.trim() === "") return; // Don't send empty messages
    // const newMessages = [
    //   ...messages,
    //   { role: "user", content: inputMessage, createdAt: Date.now() },
    // ];
    // setMessages(newMessages);
    console.log(inputMessage);
    setInputMessage("");
    await sendMessageToAcyToo(inputMessage);

    // Send the message to the chatbot and get the response
    //const aiResponse = await sendMessageToAcyToo(newMessages);
    // if (aiResponse) {
    //   setMessages((prevMessages) => [
    //     ...prevMessages,
    //     { role: "ai", content: aiResponse, createdAt: Date.now() },
    //   ]);
    // }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View
            style={item.role === "user" ? styles.userMessage : styles.aiMessage}
          >
            <Text>{item.content}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messageList}
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
    </View>
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
  messageList: {
    paddingVertical: 16, // Add spacing between messages and screen
  },
});

export default ChatScreen;
