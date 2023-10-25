// UserContext.ts
import React from "react";

// Define a TypeScript interface for the user data
export interface UserProps {
  username: string;
  displayName: string;
  avatarUrl: string;
  email: string;
}

// Create the context with default initial data
export const UserContext = React.createContext<UserProps>({
  username: "",
  displayName: "",
  avatarUrl: "",
  email: "",
});
