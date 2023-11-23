import React, { useEffect, useContext, useState, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
//import Markdown from "@valasolutions/react-native-markdown";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Helmet } from "react-helmet-async";

import utils, { InteractionManager, sendMessage } from "./utils"; // Import your utility module
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
  Image,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // Import useNavigation
import { chat_send } from "./assets/icons"; // Import the SVG components
import { CellType } from "./Cell";
import MiniCell from "./MiniCell";
import { RouteProp } from "@react-navigation/native";
import { MainTabParamList } from "./navigationTypes";
import { UserContext } from "./UserContext";
const aiAvatar = require("./assets/gate_ai_logo.png");

const TextComponent = ({
  node,
  ...props
}: {
  node: any;
  children: any;
  key?: string;
}) => <Text style={styles.text} {...props} />;

const components = {
  p: TextComponent,
  h1: TextComponent,
  h2: TextComponent,
  h3: TextComponent,
  h4: TextComponent,
  h5: TextComponent,
  h6: TextComponent,
  strong: TextComponent,
  del: TextComponent,
  em: TextComponent,
  img: TextComponent,
  ul: TextComponent,
  ol: TextComponent,
  li: TextComponent,
  code: TextComponent,
  pre: TextComponent,
  blockquote: TextComponent,
  hr: TextComponent,
  th: TextComponent,
  td: TextComponent,
  tr: TextComponent,
  table: TextComponent,
};

interface ChatScreenProps {
  route: RouteProp<MainTabParamList, "Chat">;
}
const AIAvatar = () => <Image source={aiAvatar} style={styles.avatar} />;
const interactionManager = InteractionManager.getInstance();

const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === "web") {
        // Change the URL without causing a navigation event
        window.history.pushState(null, "", `/chat`);
      }
    }, [])
  );
  const { displayName, avatarUrl } = useContext(UserContext);

  const [cell, setCell] = useState(route.params?.cell);

  const [isAtBottom, setIsAtBottom] = useState(true); // Add this state

  const flatListRef = useRef<FlatList>(null); // Add this ref

  const navigation = useNavigation();
  const [sendDisabled, setSendDisabled] = useState(true); // Add this line

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
      setSendDisabled(false);
      setCell(undefined); // Use setCell to update the value of cell
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
      console.log(data.chat_id);
      setMessages(data.chat_history);
      setTimeout(() => {
        if (flatListRef.current) {
          console.log("scrolling to end instantly");
          flatListRef.current.scrollToEnd({ animated: false });
        }
      }, 50);
      setSendDisabled(false);
    } else {
      console.log((await response.json()).message);
    }
  };
  const handleMessageSend = async () => {
    if (inputMessage.trim() === "" || sendDisabled || !chatId) return; // Don't send empty messages or if already sending or if chatid null
    const message = inputMessage;
    setInputMessage("");
    setSendDisabled(true); // Set isSending to true when sending a message
    let newMessages = [
      ...messages,
      {
        role: "user",
        content: message,
      },
    ];
    const messagesToSend = newMessages.slice(-15); // Create a new copy of the last 15 messages

    // temp message
    newMessages.push({ role: "assistant", content: "..." });
    setMessages(newMessages);
    console.log("sending messages: ", messagesToSend);

    const aiRespondedMessage = await sendMessage(chatId, messagesToSend, cell);
    // pop the temp message
    newMessages.pop();
    if (aiRespondedMessage) {
      setMessages([...newMessages, aiRespondedMessage]);
      console.log(aiRespondedMessage);
    } else {
      // error

      // pop the user message
      newMessages.pop();
      setMessages([...newMessages]);

      // rollback input
      setInputMessage(message);
    }

    setSendDisabled(false); // Set isSending back to false after message is sent
  };
  useEffect(() => {
    setCell(route.params?.cell);
  }, [route.params?.cell]);
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
          }, 50);
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
      headerRight: () => (
        <TouchableOpacity onPress={newChat} style={{ paddingRight: 22 }}>
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
      {cell && <MiniCell cell={cell} source="chat_context" />}
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
            <View style={styles.messageHeader}>
              {item.role === "user" ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
              ) : (
                <AIAvatar />
              )}
              <Text style={styles.roleName}>
                {item.role === "user" ? displayName : "Gate AI"}
              </Text>
            </View>
            <View style={styles.text}>
              <Markdown remarkPlugins={[remarkGfm]}>{item.content}</Markdown>
              {/* removed markdown  style={styles.text}   */}
            </View>
          </View>
        )}
      />
      {!isAtBottom && (
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: "center",
            flexDirection: "row",
            marginBottom: 20,
            backgroundColor: "transparent",
          }}
          onPress={() => {
            if (flatListRef.current) {
              console.log("scrolling to end");
              flatListRef.current.scrollToEnd({ animated: true });
            }
          }}
        >
          {/* Replace "Scroll to bottom" with your SVG */}
          <Text>Scroll to Bottom</Text>
        </TouchableOpacity>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Message"
          value={inputMessage}
          onChangeText={(text) => setInputMessage(text)}
          multiline // This makes the TextInput multiline
        />
        <TouchableOpacity
          onPress={handleMessageSend}
          disabled={sendDisabled}
          style={styles.sendButton}
        >
          {sendDisabled ? (
            <chat_send.off width="50" height="50" />
          ) : (
            <chat_send.on width="50" height="50" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  sendButton: {
    width: 27,
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  text: {
    fontSize: 15,
    marginHorizontal: 36,
    fontFamily: "System",
  },
  userMessage: {
    fontSize: 15,
    alignSelf: "flex-start",
    backgroundColor: "transparent", // change this to 'white' for a white background
    padding: 8,
    marginVertical: 8,
    borderRadius: 8,
  },
  aiMessage: {
    fontSize: 15,
    alignSelf: "flex-start",
    backgroundColor: "transparent", // change this to 'white' for a white background
    padding: 8,
    marginVertical: 4,
    borderRadius: 8,
  },

  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 15,
    marginRight: 10,
    marginLeft: 6,
  },
  roleName: {
    fontSize: 15,
    fontWeight: "bold",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    fontSize: 14, // adjust this value as needed
    flex: 1,
    marginRight: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 16,
    padding: 8,
    height: 40, // Set your desired max height here
  },
});

export default ChatScreen;
