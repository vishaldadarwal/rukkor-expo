import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text } from "react-native";
import LoginScreen from "../../screens/Auth/login";
import SignUpScreen from "../../screens/Auth/Registration/singUp";
import ProfileSetupScreen from "../../screens/Auth/Registration/ProfileSetup";
import RealIdScreen from "../../screens/Auth/Registration/RealId";
import CareScreen from "../../screens/Auth/Registration/Care";
import AliasScreen from "../../screens/Auth/Registration/alias";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen}/>
      <Stack.Screen name="RealId" component={RealIdScreen}/>
      <Stack.Screen name="Alias" component={AliasScreen}  />
      <Stack.Screen name="Care" component={CareScreen}  />
    </Stack.Navigator>
  );
}
