import {
  ChatRequest,
  // ChatResponse,
  ModelType,
  Site,
  Message,
} from "./model/base";
import { ChatModelFactory } from "./model";
import {
  ComError,
  // Event,
  // EventStream,
  // getTokenSize,
  // OpenaiEventStream,
  parseJSON,
  // randomStr,
  // ThroughEventStream,
} from "./utils";
// import { Config } from "./utils/config";
// import { initLog } from "./utils/log";

const chatModel = new ChatModelFactory();

// Define a function to send a sample message to the chatbot
const sendMessageToChatbot = async () => {
  // Replace 'YourPromptHere' with the message you want to send
  const prompt = "are you gpt 4?";
  const site = Site.VVM; // You can change the site if needed
  const model = ModelType.GPT3p5Turbo; // You can change the model if needed

  const chat = chatModel.get(site);

  if (!chat) {
    throw new ComError(`Not supported site: ${site}`, ComError.Status.NotFound);
  }

  let req: ChatRequest = {
    prompt,
    messages: parseJSON<Message[]>(prompt, [{ role: "user", content: prompt }]),
    model,
  };

  if (typeof req.messages !== "object") {
    req.messages = [{ role: "user", content: prompt }];
  }

  req = await chat.preHandle(req);

  const data = await chat.ask(req);

  if (data && data.error) {
    console.error("Chatbot error:", data.error);
  } else {
    console.log("User message:", prompt);
    console.log("Chatbot response:", data?.content || "");
  }
};

// Call the function to send a sample message
sendMessageToChatbot();
