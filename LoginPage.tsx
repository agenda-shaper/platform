import React, { useState, useContext } from "react";
import utils from "./utils"; // Import your utils module
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { AuthNavigationProp } from "./navigationTypes";

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
import { AuthContext } from "./auth-context"; // Import your AuthContext

const LoginPage = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setError] = useState("");

  const navigation = useNavigation<AuthNavigationProp>();

  const navigateToRegister = () => {
    // Use the navigation object to navigate to the RegisterPage
    navigation.replace("Register");
  };

  const handleLogin = async () => {
    try {
      if (
        !utils.validator.isEmail(identifier) &&
        !utils.validator.isAlphanumeric(identifier)
      ) {
        setError("Invalid email or username format");
        return;
      } else if (!password) {
        setError("Please enter your password");
        return;
      }
      // Make a POST request to your server's login endpoint

      const response = await utils.auth({
        action: "login",
        data: { identifier, password },
      });

      if (response.ok) {
        // Login was successful
        const data = await response.json();
        console.log("Login successful", data);
        await AsyncStorage.setItem("token", data.token);

        setIsLoggedIn(true);
      } else {
        // Login failed, display an error message
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      console.error("Error during login", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View>
          <Text style={styles.heading}>Log In </Text>
          <TextInput
            style={styles.input}
            placeholder="Email or Username"
            value={identifier}
            onChangeText={(text) => setIdentifier(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
          {errorMessage ? ( // Display the error message conditionally
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}
          <Text style={styles.registerText}>
            Don't have an account?{" "}
            <Text style={{ color: "blue" }} onPress={navigateToRegister}>
              Register
            </Text>
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
  registerText: {
    textAlign: "left",
    marginTop: 16,
  },
  errorMessage: {
    color: "red", // Style the error message as needed
    textAlign: "center",
    marginTop: 8,
  },
});

export default LoginPage;
