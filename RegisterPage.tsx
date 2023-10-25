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
const RegisterPage = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setdisplayName] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Add state for error message

  const navigation = useNavigation<AuthNavigationProp>();

  type Check = [boolean, string];
  const navigateToLogin = () => {
    // Use the navigation object to navigate to the RegisterPage
    navigation.replace("Login");
  };

  const handleRegister = async () => {
    setErrorMessage("");
    const checks: Check[] = [
      [utils.validator.isEmail(email), "Invalid email format"],
      [
        utils.validator.isAlphanumeric(username),
        "Username can only contain letters and numbers",
      ],
      [
        utils.validator.isLength(username, { min: 3, max: 16 }),
        "Username must be between 3 and 16 characters long",
      ],
      [
        utils.validator.isLength(password, { min: 8, max: 64 }),
        "Password must be between 8 and 64 characters long",
      ],
      [password === repeatPassword, "Passwords do not match"],
      [
        utils.validator.isLength(displayName, { min: 3, max: 20 }),
        "Password must be between 3 and 20 characters long",
      ],
    ];
    for (let [check, message] of checks) {
      if (!check) {
        setErrorMessage(message);
        return;
      }
    }
    try {
      const response = await utils.auth({
        action: "register",
        data: { email, username, password, displayName },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful", await data);

        // Store the token
        await AsyncStorage.setItem("token", data.token);

        setIsLoggedIn(true);
      } else {
        setErrorMessage((await response.json()).message);
      }
    } catch (error) {
      console.error("Error during registration", error);
      setErrorMessage("An unknown error occurred during registration");
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
            <Text style={{ color: "blue" }} onPress={navigateToLogin}>
              Log In
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
