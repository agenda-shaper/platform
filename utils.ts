export const API_BASE_URL =
  "https://nodejs-serverless-function-express-snowy-eight.vercel.app";
export const APP_NAME = "Platform";
import validator from "validator";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  auth,
  validator,
};

export interface Interaction {
  id: string;
  type:
    | "post_click"
    | "post_visibility"
    | "innercell_visibility"
    | "like"
    | "save";
  data?: object;
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
    if (interaction.type == "save") {
      // filter if theres any interactions with the same type and id
      // if yes remove them both because they neutralise
    } else if ((interaction.type = "like")) {
      // same here
    }

    this.interactions.push(interaction);
  }

  // Method to remove an interaction
  public remove(interaction: Interaction): void {
    this.interactions = this.interactions.filter((i) => i !== interaction);
  }

  // Method to start sending interactions to the server
  public start(): void {
    this.intervalId = setInterval(() => {
      if (this.interactions.length > 0) {
        // Replace with your actual API call
        console.log(
          `Sending ${this.interactions.length} interactions to server:\n`,
          this.interactions
        );
        this.interactions = [];
      }
    }, this.sendInterval);
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
