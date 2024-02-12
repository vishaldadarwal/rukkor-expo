import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


const SplashScreen = ({ navigation }) => {

const gotoScreen=async()=>{
   let token = await AsyncStorage.getItem("userToken")
   if(token){
    navigation.navigate("Home")
   }else{
    navigation.navigate("Auth")
   }
}

  useEffect(()=>{
    setTimeout(() => {
      gotoScreen()
    }, 2000);
  },[])

  return (
    <View>
      <Image
        style={{ width: "100%", height: "100%", 
        backgroundColor: "#E7651C" }}
        source={require("../../../assets/Splash-Screen.png")}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
});

export default SplashScreen;
