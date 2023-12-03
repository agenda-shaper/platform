import React, { useState, useContext } from "react";
import utils from "../Misc/utils"; // Import your utils module
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { AuthNavigationProp,MainStackNavigationProp } from "../Navigation/navigationTypes";

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
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import {UserContext} from "../Misc/Contexts"

const LoginPage = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  //const {setUserData} = useContext(UserContext);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setError] = useState("");
  const mainNavigation = useNavigation<MainStackNavigationProp>();

  const navigation = useNavigation<AuthNavigationProp>();

  const navigateToRegister = () => {
    // Use the navigation object to navigate to the RegisterPage
    navigation.replace("Register");
  };
  const handleGoogleLogin = async (payload: any) => {
    try {
      const response = await utils.auth({
        action: "google_login",
        data: payload,
      });

      if (response.ok) {
        // Login was successful
        const data = await response.json();
        console.log("Login successful", data);
        await AsyncStorage.setItem("token", data.token);

        setIsLoggedIn(true);
        // setUserData(data.userData);
        mainNavigation.navigate("Home");
      } else {
        // Login failed, display an error message
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      console.error("Error during Google login", error);
    }
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
        //setUserData(data.userData);
        mainNavigation.navigate("Home");
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
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View>
        <Text style={styles.heading}>Log In </Text>
        <View style={styles.googleSignIn}>
          <GoogleOAuthProvider clientId="204588103385-n5a2hfm0b9tjklv8a8si78l5tfkua245.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
            />
          </GoogleOAuthProvider>
        </View>
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
    // </TouchableWithoutFeedback>
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
  googleSignIn: {
    marginVertical: 16,
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
