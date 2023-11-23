// UserContext.ts
import React from "react";
import { CellProps } from "./Cell";

// Define a TypeScript interface for the user data
export interface UserProps {
  user_id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  email: string;
}
// Create the context with default initial data
export const UserContext = React.createContext<UserProps>({
  user_id: "",
  username: "",
  displayName: "",
  avatarUrl: "",
  email: "",
});
