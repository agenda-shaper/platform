export const API_BASE_URL = "https://gateapi.vercel.app";
export const APP_NAME = "Platform";
import validator from "validator";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { fetch } from "react-native-fetch-api";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { CellProps } from "../Posts/Cell";
interface Message {
  role: string;
  content: string;
}
import EventSource from "react-native-sse";

  export const eventSourceChat = async (messages: Message[], chat_id: string, context_cell?: CellProps) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("token not set");
      }

      const context_cellString = JSON.stringify(context_cell);
      const messagesString = JSON.stringify(messages); 

      const url = `${API_BASE_URL}/chat/send?chat_id=${encodeURIComponent(chat_id)}&messagesString=${encodeURIComponent(messagesString)}&context_cell=${encodeURIComponent(context_cellString)}`;
      const sse = new EventSource(url,{
        headers: {
          Authorization: token,
        },
      });
      return sse;
    } catch (error) {
      throw error; // Throw the error to be handled by the caller
    }
  };


  export async function sendMessage(
    chat_id: string,
    messages: Message[],
    context_cell?: CellProps
  ) {
    const payload = { chat_id, messages, context_cell };
    
    try {
      const response: any = await post("/chat/send", payload);
      if (response.ok) {
        const data = await response.json();
        const aiResponse: Message = data.message;
        return aiResponse;
      } else {
        const errorData = await response.json();
        console.error(errorData);
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

// Function to make a GET request
export const get = async (uri: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("token not set");
    }
    const response = await fetch(`${API_BASE_URL}${uri}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error; // Throw the error to be handled by the caller
  }
};

// Function to make a GET request
export const noAuthGet = async (uri: string) => {
  try {
    let token = await AsyncStorage.getItem("token");
    if (!token) {
      token = "NO_AUTH"
    }
    const response = await fetch(`${API_BASE_URL}${uri}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error; // Throw the error to be handled by the caller
  }
};

const convertImageToBase64 = async (localUri: string) => {
  try {
    if (Platform.OS === "web") {
      // On web, the localUri is already a base64 string
      const base64Index = localUri.indexOf("base64,");
      return localUri.substring(base64Index + "base64,".length);
    } else {
      const base64 = await FileSystem.readAsStringAsync(localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    }
  } catch (error) {
    throw new Error("Error converting image to base64: " + error);
  }
};
export async function uploadImage(localUri: string): Promise<any> {
  const imageBase64 = await convertImageToBase64(localUri);

  const formData = new FormData();
  formData.append("image", imageBase64);

  const response = await fetch(
    "https://api.imgbb.com/1/upload?key=c16460ec60fe42c07eb757018ea9e5dd",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload image" + response.status);
  }

  const data = await response.json();

  if (data.success) {
    return data.data.url;
  } else {
    console.error("Error uploading image:", data);
    return null;
  }
}

// Function to make a POST request
export const post = async (uri: string, payload: any) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("token not set");
    }
    const response = await fetch(`${API_BASE_URL}${uri}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(payload),
    });

    return response;
  } catch (error) {
    throw error; // Throw the error to be handled by the caller
  }
};


// Function to make a POST request

// no token needed
export const auth = async (payload: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log(response);
    return response;
  } catch (error) {
    throw error; // Throw the error to be handled by the caller
  }
};

// Create an object to export all functions and constants together
const utils = {
  API_BASE_URL,
  APP_NAME,
  get,
  post,
  noAuthGet,
  auth,
  validator,
};

export interface Interaction {
  post_id: string;
  type:
    | "post_click"
    | "post_visibility"
    | "innercell_visibility"
    | "like"
    | "save"
    | "ask";
  data?: any;
}

export class InteractionManager {
  private static instance: InteractionManager;
  private interactions: Interaction[];
  private intervalId: NodeJS.Timeout | null;
  private sendInterval: number;

  private constructor() {
    this.interactions = [];
    this.intervalId = null;
    this.sendInterval = 3000;
  }

  // Method to add an interaction
  public add(interaction: Interaction): void {
    // for spam stuff
    if (interaction.type == "save" || interaction.type == "like") {
      // filter if theres any interactions with the same type and id
      // if yes remove them both because they neutralise
    }

    this.interactions.push(interaction);
  }

  // Method to remove an interaction
  public remove(interaction: Interaction): void {
    this.interactions = this.interactions.filter((i) => i !== interaction);
  }

  public async send() {
    try {
      if (this.interactions.length > 0) {
        const payload = { interactions: this.interactions };
        console.log(payload);

        const response = await post("/utils/react", payload);
        if (response.status === 200) {
          // clear
          this.interactions = [];
        } else {
          console.log("non 200");
          const data = await response.json();
          throw new Error(data);
        }
      }
    } catch (error) {
      console.error("Error sending interactions:", error);
    }
  }

  // Method to start sending interactions to the server
  public start() {
    const sendAndScheduleNext = async () => {
      await this.send();
      this.intervalId = setTimeout(sendAndScheduleNext, this.sendInterval);
    };
    sendAndScheduleNext();
  }

  // Method to stop sending interactions to the server
  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Method to get the Singleton instance
  public static getInstance(): InteractionManager {
    if (!InteractionManager.instance) {
      InteractionManager.instance = new InteractionManager();
      InteractionManager.instance.start();
    }
    return InteractionManager.instance;
  }
}

export default utils;
