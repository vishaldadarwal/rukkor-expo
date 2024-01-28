import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import * as Device from 'expo-device';
import { loginUser, setProfileData } from "../../../redux/reducers/user";
import {useDispatch,useSelector} from "react-redux";

const SignUp = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(true);
  const [cShowPassword, setCshowPassword] = useState(true);

  const dispatch = useDispatch();

  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      cpassword: "",
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    SignUpMutation.mutate(data);
    return;
  };

  const SignUpMutation = useMutation({
    mutationFn: (data) => {
      return axios.post("users/register", {
        primary_email: data.email,
        os_platform: Platform.OS,
        os_platform_version: Device.osVersion,
        user_agent: "user_agent223",
        device_name: Device.deviceName,
        type: Device.deviceType,
        password: data.password,
        device_id: "123",
      });
    },
  });

  useEffect(() => {
    if (SignUpMutation.isError) {
      // console.log("error", SignUpMutation.error);
      Alert.alert("Something went wrong!");
      SignUpMutation.reset();
    } else if (SignUpMutation.isSuccess) {
      // console.log("signup--", SignUpMutation.data.data);
      if (SignUpMutation.data?.data?.status == 0) {
        var message = "Unable to login!";
        if (SignUpMutation.data?.data?.message) {
          message = SignUpMutation.data?.data?.message;
        }
        Alert.alert(message);
        SignUpMutation.reset();
      } else {
        var message = "Register Successfully!";
        if (SignUpMutation.data?.data?.message) {
          message = SignUpMutation.data?.data?.message;
        }
      
        var payload = {
          user : SignUpMutation.data?.data?.info,
          loggedIn : true,
          AuthToken : SignUpMutation.data?.data?.jwt_token
        }
        dispatch(loginUser(payload));
        var payload = {
          userProfile: null
        }
        dispatch(setProfileData(payload));
        navigation.navigate("Login")
        Alert.alert(message);
      }
      SignUpMutation.reset();
    }
  }, [SignUpMutation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.scrollContainer}>
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>Create new account</Text>
            <Text style={styles.labelStyle}>E-mail*</Text>
            <View style={styles.inputView}>
              <Image
                source={require("../../../../assets/email.png")}
                resizeMode="contain"
                style={styles.imageStyle}
              />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your e-mail"
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                  />
                )}
                name="email"
                rules={{
                  required: "Email is required!",
                  pattern: {
                    value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/,
                    message: "Invalid Email",
                  },
                }}
              />
            </View>
            {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

            <Text style={styles.labelStyle}>Password*</Text>
            <View
              style={[styles.inputView, { justifyContent: "space-between" }]}
            >
              <Image
                source={require("../../../../assets/lock.png")}
                resizeMode="contain"
                style={styles.imageStyle}
              />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Choose a password"
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    secureTextEntry={showPassword}
                  />
                )}
                name="password"
                rules={{
                  required: "Password is required!",
                  minLength: {
                    value: 10,
                    message: "Password must be 10 character long!",
                  },
                  pattern: {
                    value:
                      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                    message: "Please ensure your password meets the criteria.",
                  },
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  setShowPassword(!showPassword);
                }}
              >
                <Image
                  source={
                    showPassword
                      ? require("../../../../assets/hide.png")
                      : require("../../../../assets/eye-view.png")
                  }
                  resizeMode="contain"
                  style={styles.imageStyle}
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

            <Text style={styles.labelStyle}>Confirm Password*</Text>
            <View
              style={[styles.inputView, { justifyContent: "space-between" }]}
            >
              <Image
                source={require("../../../../assets/lock.png")}
                resizeMode="contain"
                style={styles.imageStyle}
              />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    secureTextEntry={cShowPassword}
                  />
                )}
                name="cpassword"
                rules={{
                  required: "Confirm Password is require!",
                  validate: (val) => {
                    if (watch("password") != val) {
                      return "Your passwords do no match";
                    }
                  },
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  setCshowPassword(!cShowPassword);
                }}
              >
                <Image
                  source={
                    cShowPassword
                      ? require("../../../../assets/hide.png")
                      : require("../../../../assets/eye-view.png")
                  }
                  resizeMode="contain"
                  style={styles.imageStyle}
                />
              </TouchableOpacity>
            </View>
            {errors.cpassword && <Text style={styles.error}>{errors.cpassword.message}</Text>}
          </View>
          <View
            style={styles.passView}
          >
            <Text style={styles.passText}>
              Pick a strong password, requirements are at least one of each,
              minimum 10 characters.{`\n`}• Uppercase letter ( A-Z ){`\n`}•
              Lowercase letter ( a-z ){`\n`}• Number ( 0-9 ){`\n`}• Symbol (
              !@#$%^&* ){`\n`}
            </Text>
          </View>
          <View
            style={styles.buttonView}
          >
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              // onPress={()=>navigation.navigate("ProfileSetup")}
              style={styles.next}
            >
              {SignUpMutation.isPending ? (
                <ActivityIndicator color={"#ffffff"} ></ActivityIndicator>
              ) : (
                <View
                  style={styles.buttotTextView}
                >
                  <Text
                    style={styles.nextText}
                  >
                    Next
                  </Text>
                  <Image
                    source={require("../../../../assets/next.png")}
                    resizeMode="contain"
                    style={styles.imageStyle}
                  />
                </View>)}

            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelText}>
                Cancel account creation
              </Text>
            </TouchableOpacity>

            <View style={{ alignItems: "center" }}>
              <View
                style={styles.bottomLogo}
              >
                <Image
                  source={require("../../../../assets/logo.png")}
                  style={styles.bottomLogoImg}
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loader: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    flex: 1,
    justifyContent: "center",
    zIndex: 99999999,
    position: "absolute",
    width: Dimensions.get("window").width,
    height: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
    marginTop: 30,
    color: "#000000",
    marginTop:50
  },
  input: {
    height: 40,
    // width: 300,
    flex: 1,
    borderWidth: 0,
    // marginBottom: 16,
    // paddingHorizontal: 20,
    marginLeft: 5,
    backgroundColor: "#F3F3F3",
  },
  inputView: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 55,
    backgroundColor: "#F3F3F3",
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  imageStyle: {
    width: 15,
    height: 15,
  },
  labelStyle: {
    fontSize: 14,
    color: "#000",
    // fontWeight: "bold"
    marginBottom: 8,
    marginTop: 30,
  },
  error: {
    color: "red"
  },
  safeArea:{ flex: 1, backgroundColor:"#ffffff" },
  passView:{
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFEBB6",
    padding: 10,
    borderRadius: 8,
    marginVertical: 15,
  },
  passText:{ color: "#000000", fontSize: 14 },
  buttonView:{ flex: 1, justifyContent: "flex-end", marginTop: 10,marginBottom:50 },
  next:{
    backgroundColor: "#E7651C",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    height:48
  },
  buttotTextView:{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  nextText:{
    textAlign: "center",
    color: "white",
    marginRight: 5,
  },
  cancelBtn:{
    padding: 15,
    borderRadius: 8,
    borderColor: "#E7651C",
  },
  cancelText:{ textAlign: "center", color: "#E7651C", marginVertical: 5 },
  bottomLogo:{
    backgroundColor: "#E7651C",
    padding: 10,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomLogoImg:{ width: 15, height: 15 }
});

export default SignUp;
