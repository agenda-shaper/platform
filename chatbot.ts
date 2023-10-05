import EventSource from "react-native-event-source";
interface Message {
  role: string;
  content: string;
  createdAt: number;
}

export async function sendMessageToAcyToo(messageContent: string) {
  // Create a new message
  const message = {
    role: "user",
    content: messageContent,
    createdAt: Date.now(),
  };

  // Create a new request
  const req = {
    key: "", // Replace with your key
    model: "GPT3p5Turbo", // Or any other model you want to use
    messages: [message],
    temperature: 1.0,
    password: "", // Replace with your password
  };

  try {
    // Send the request to the chatbot
    const res = await fetch("https://chat.acytoo.com/api/completions", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
        Accept: "*/*",
        "Cache-Control": "no-cache",
        "Proxy-Connection": "keep-alive",
      },
      body: JSON.stringify(req),
    });

    // Check for errors
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    // Create an EventSource
    const eventSource = new EventSource(res.url);

    // Listen for messages
    eventSource.addEventListener("message", (event) => {
      console.log("Received message:", event.data);
    });

    // Listen for errors
    eventSource.addEventListener("error", (event) => {
      console.error("Error:", event);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
