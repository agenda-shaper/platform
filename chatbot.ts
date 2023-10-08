import EventSource from "react-native-event-source";

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
      "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.",
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
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

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
