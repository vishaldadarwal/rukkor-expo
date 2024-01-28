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
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginUser, setProfileData } from "../../redux/reducers/user";
import { useDispatch, useSelector } from "react-redux";
import * as Device from 'expo-device';
// import RNPickerSelect from 'react-native-picker-select';
// import { Dropdown } from 'react-native-material-dropdown';
// import { Picker } from '@react-native-picker/picker';


const LoginScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const languageData = [
    { label: "English", value: "English" },
    { label: "French", value: "French" },
    { label: "Russian", value: "Russian" },
    { label: "Spanish", value: "Spanish" },
  ];
  const [modalVisible, setModalVisible] = useState(false);


  const dispatch = useDispatch();
  const redirectScreen = useSelector(state => state.user.ProfileSetupScreen);

  // useEffect(() => {
  //   console.log(redirectScreen);

  //   if (redirectScreen == "RealId") {
  //     // navigation.navigate("Alias");
  //     //navigate to real id setup form
  //   } else if (redirectScreen == "Alias") {
  //     //navigate to alias setup form
  //     navigation.navigate("Alias");
  //   } else if (redirectScreen == "Home") {
  //     //navigate to home screen
  //     navigation.navigate("Alias");
  //   }
  // }, [redirectScreen])



  const gotToScreen = () => {
    var payload = {
      userProfile: null
    }
    dispatch(setProfileData(payload));
    let data = LoginMutation.data?.data?.info
    if (data.username == null) {
      navigation.navigate("ProfileSetup")
    } else if (data.work_place == null || data.work_role == null) {
      navigation.navigate("Care")
    } else if (data.alias == null || data.alias_name == null) {
      navigation.navigate("Alias")
    } else {
      navigation.navigate("Home")
    }
  }
  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data) => {
    LoginMutation.mutate(data);
    return;
  };

  const LoginMutation = useMutation({
    mutationFn: (data) => {
      return axios.post("users/login", {
        primary_email: data.email,
        os_platform: Platform.OS,
        os_platform_version: Device.osVersion,
        user_agent: "user_agent223",
        device_name: Device.deviceName,
        type: Device.deviceType,
        password: data.password,
        device_id: "123",
        language: selectedLanguage,
      });
    },
  });


  useEffect(() => {
    if (LoginMutation.isError) {
      console.log("error", LoginMutation.error);
      Alert.alert("Something went wrong!");
      LoginMutation.reset();
    } else if (LoginMutation.isSuccess) {
      console.log(LoginMutation.data.data);
      if (LoginMutation.data?.data?.status == 0) {
        var message = "Unable to login!";
        if (LoginMutation.data?.data?.message) {
          message = LoginMutation.data?.data?.message;
        }
        Alert.alert(message);
        LoginMutation.reset();
      } else {
        var payload = {
          user: LoginMutation.data?.data?.info,
          loggedIn: true,
          AuthToken: LoginMutation.data?.data?.jwt_token
        }
        dispatch(loginUser(payload));
        gotToScreen()
        // navigation.navigate("Home")

        Alert.alert("Logged In successfully!");
      }
      LoginMutation.reset();
    }
  }, [LoginMutation]);

  const renderLanguageItem = (language) => (
    <TouchableOpacity
      key={language?.value}
      onPress={() => {
        setSelectedLanguage(language?.value);
        setModalVisible(false);
      }}
      style={styles.renderText}
    >
      <Text style={{ fontSize: 16 , color: language?.value == selectedLanguage ? "#E7651C":"#000000" }}>{language?.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{flex:1}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.container}>
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <View
            style={styles.logoImageView}
          >
            <Image
              source={require("../../../assets/logo.png")}
              style={styles.logoImage}
            />
          </View>
        </View>
        <View>
          <Text style={styles.labelStyle}>E-mail</Text>
          <View style={styles.inputView}>
            <Image
              source={require("../../../assets/usericon.png")}
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
              rules={{ required: "Email is required!" }}
            />
          </View>
          {errors.email && <Text style={styles.error} >{errors.email.message}</Text>}

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.labelStyle}>Password</Text>
            <Text style={[styles.labelStyle, { color: "#E7651C" }]}>
              Forget password
            </Text>
          </View>
          <View style={[styles.inputView, { justifyContent: "space-between" }]}>
            <Image
              source={require("../../../assets/lock.png")}
              resizeMode="contain"
              style={styles.imageStyle}
            />
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  secureTextEntry={showPassword}
                />
              )}
              name="password"
              rules={{ required: "Password is required!" }}
            />
            <TouchableOpacity
              onPress={() => {
                setShowPassword(!showPassword);
              }}
            >
              <Image
                source={
                  showPassword
                    ? require("../../../assets/hide.png")
                    : require("../../../assets/eye-view.png")
                }
                resizeMode="contain"
                style={styles.imageStyle}
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.error} >{errors.password.message}</Text>}
          <Text style={styles.labelStyle}>Language</Text>

          <View style={styles.inputViewOne}>
            <Image
              source={require("../../../assets/lang.png")}
              resizeMode="contain"
              style={styles.imageStyle}
            />
            <View style={{ width: "90%" }}>
              <TouchableOpacity onPress={() => setModalVisible(true)} style={{ padding: 10, borderWidth: 0, borderColor: '#ccc' }}>
                <Text style={{ fontSize: 16 }}>{selectedLanguage}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            // onPress={() => navigation.navigate("RealId")}
            style={styles.submitButton}
          >
            {LoginMutation.isPending ? (
              <ActivityIndicator color={"#ffffff"} animating={LoginMutation.isPending} />
            ) : (
              <Text style={{ textAlign: "center", color: "white" }}>Log in</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("SignUp")}
            style={styles.newAccount}
          >
            <Text style={{ textAlign: "center", color: "#E7651C" }}>
              Create new account
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalStyleOne}>
            <View style={styles.modalStyleTwo}>
              {languageData.map(renderLanguageItem)}
              <Button title="Close" color={"#E7651C"}  onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </View>
      </ScrollView>
    </View>
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
    flex:1,
    backgroundColor: "white",
    paddingTop: 20,
    paddingBottom: 50,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 40,
    flex: 1,
    borderWidth: 0,
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
  inputViewOne: {
    borderRadius: 8,
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    paddingHorizontal: 10,
    marginBottom:20,
  },
  imageStyle: {
    width: 20,
    height: 20,
  },
  labelStyle: {
    fontSize: 14,
    color: "#000",
    // fontWeight: "bold",
    marginBottom: 8,
    marginTop: 30,
  },
  pickerSelectStyles: {
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 0,
      borderColor: "gray",
      borderRadius: 4,
      color: "black",
      paddingRight: 30,
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0,
      borderColor: "purple",
      borderRadius: 8,
      color: "black",
      paddingRight: 30,
    },
  },
  error: {
    color: "red"
  },
  renderText:{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  logoImageView:{
    backgroundColor: "#E7651C",
    padding: 50,
    borderRadius: 100,
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage:{ width: 40, height: 40 },
  submitButton:{
    backgroundColor: "#E7651C",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    height: 48
  },
  newAccount:{
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: "#E7651C",
    borderWidth: 1,
    height: 48,
    backgroundColor: "#ffffff"
  },
  modalStyleOne:{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "rgba(0, 0, 0, 0.3)", },
  modalStyleTwo:{ backgroundColor: 'white', width: '80%', padding: 20, borderRadius: 10, elevation: 5 }
});

export default LoginScreen;
