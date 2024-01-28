import { NavigationContainer } from "@react-navigation/native";
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";
import axios from "axios";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthStack from "./src/navigation/stacks/AuthStack";
import { Provider } from 'react-redux'
import store from "./src/redux/store";
import MainStack from "./src/navigation/stacks/MainStack";

axios.defaults.baseURL = "https://api-shield.rukkor.dev/api/";

// Create a client
const queryClient = new QueryClient();

export default function App() {
  return (
    // Provide the client to your App
    <Provider store={store}>
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
