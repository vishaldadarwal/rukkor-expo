import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text } from "react-native";
import HomeScreen from "../../screens/Home/Home";
import AuthStack from "./AuthStack";


const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
