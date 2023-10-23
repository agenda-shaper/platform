import EventSource from "react-native-event-source";

//import { fetch } from "react-native-fetch-api";

interface Message {
  role: string;
  content: string;
}

export async function sendMessage(messages: Message[]) {
  // Create a new request with the entire conversation history
  const req = {
    key: "", // Replace with your key
    messages: messages,
    model: { id: "gpt-3.5-turbo", name: "GPT-3.5" },
    prompt:
      "You are an AI Chatbot powered by GPT 4. Follow the user's instructions carefully. Respond using markdown.",
    temperature: 0.7,
  };

  try {
    // Send the request to the chatbot
    const res = await fetch("https://chat.aivvm.com/api/chat", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
      //reactNative: { textStreaming: true },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    // const reader = res.body.getReader();
    // const decoder = new TextDecoder("utf-8");

    // reader
    //   .read()
    //   .then(function processText({
    //     done,
    //     value,
    //   }: {
    //     done: boolean;
    //     value: Uint8Array;
    //   }) {
    //     if (done) {
    //       console.log("Stream complete");
    //       return;
    //     }

    //     console.log(decoder.decode(value));

    //     return reader.read().then(processText);
    //   });

    let data = await res.text();
    console.log(data);

    const aiResponse: Message = {
      role: "assistant",
      content: data,
    };

    // pop the temp msg
    messages.pop();

    return [...messages, aiResponse];
  } catch (error) {
    console.error("Error:", error);
  }
}
