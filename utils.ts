export const API_BASE_URL =
  "https://nodejs-serverless-function-express-snowy-eight.vercel.app";
export const APP_NAME = "Platform";
import validator from "validator";

// Function to make a GET request
export const get = async (uri: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}${uri}`, {
      method: "GET",
      //headers: { "Content-Type": "application/json" },
    });

    return response;
  } catch (error) {
    throw error; // Throw the error to be handled by the caller
  }
};

// Function to make a POST request
export const post = async (uri: string, payload: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}${uri}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
  validator,
};

export default utils;
