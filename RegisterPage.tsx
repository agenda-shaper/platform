import React, { useState } from "react";
import utils from "./utils"; // Import your utils module

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Add state for error message

  const handleRegister = async () => {
    // Reset the error message
    setErrorMessage("");

    // Input validation checks
    if (!utils.validator.isEmail(email)) {
      setErrorMessage("Invalid email format");
      return;
    }

    if (!utils.validator.isAlphanumeric(username)) {
      setErrorMessage("Username can only contain letters and numbers");
      return;
    }
    if (!utils.validator.isLength(username, { max: 16 })) {
      setErrorMessage("Username must be maximum 16 characters long");
      return;
    }
    if (!utils.validator.isLength(username, { min: 3 })) {
      setErrorMessage("Username must be at least 3 characters long");
      return;
    }

    if (!utils.validator.isLength(password, { min: 8 })) {
      setErrorMessage("Password must be at least 8 characters long");
      return;
    }
    if (!utils.validator.isLength(password, { max: 64 })) {
      setErrorMessage("Password must be maximum 64 characters long");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long."); // Set the error message
      return;
    }

    if (password !== repeatPassword) {
      // Passwords do not match, display an error message
      setErrorMessage("Passwords do not match"); // Set the error message
      return;
    }

    try {
      // Make a POST request to your server's registration endpoint
      const response = await utils.post("/users/auth", {
        action: "register",
        data: { email, username, password },
      });
      //console.log(response);
      if (response.ok) {
        // Registration was successful
        const data = await response.json();
        console.log("Registration successful", data);

        // You can navigate to the login page or perform any other action here
      } else {
        // Registration failed, display an error message
        const errorData = await response.json();
        console.log(errorData);
        const errorMessage = errorData.message; // Assuming the server returns an error message field
        setErrorMessage(errorMessage); // Set the error message in state
      }
    } catch (error) {
      console.error("Error during registration", error);
      setErrorMessage("An error occurred during registration"); // Set a generic error message
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View>
          <Text style={styles.heading}>Register</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            maxLength={16}
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            maxLength={64}
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Repeat Password"
            maxLength={64}
            secureTextEntry
            value={repeatPassword}
            onChangeText={(text) => setRepeatPassword(text)}
          />
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          {errorMessage ? ( // Display the error message conditionally
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={{ color: "blue" }}>Log In</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
  },
  loginText: {
    textAlign: "left",
    marginTop: 16,
  },
  errorMessage: {
    color: "red", // Style the error message as needed
    textAlign: "center",
    marginTop: 8,
  },
});

export default RegisterPage;
