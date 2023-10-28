import EventSource from "react-native-event-source";

//import { fetch } from "react-native-fetch-api";

interface Message {
  role: string;
  content: string;
}
const maxRetries = 1;

export async function sendMessage(messages: Message[]) {
  let retryCount = 0;
  while (retryCount < maxRetries) {
    const req = {
      messages: messages,
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      presence_penalty: 0,
      top_p: 1,
      frequency_penalty: 0,
      stream: false,
    };

    try {
      // Send the request to the chatbot
      const res = await fetch("https://ai.fakeopen.com/v1/chat/completions", {
        method: "POST",
        headers: {
          authority: "ai.fakeopen.com",
          accept: "*/*",
          "accept-language":
            "en,fr-FR;q=0.9,fr;q=0.8,es-ES;q=0.7,es;q=0.6,en-US;q=0.5,am;q=0.4,de;q=0.3",
          authorization:
            "Bearer pk-this-is-a-real-free-pool-token-for-everyone",
          "content-type": "application/json",
          origin: "https://chat.geekgpt.org",
          referer: "https://chat.geekgpt.org/",
          "sec-ch-ua":
            '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
        },
        body: JSON.stringify(req),
        //reactNative: { textStreaming: true },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const responseBody = await res.json();
      const aiResponseContent = responseBody.choices[0].message.content;
      console.log(aiResponseContent);

      const aiResponse: Message = {
        role: "assistant",
        content: aiResponseContent,
      };

      // pop the temp msg
      messages.pop();

      return [...messages, aiResponse];
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
