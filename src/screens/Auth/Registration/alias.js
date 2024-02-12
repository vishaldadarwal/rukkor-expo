// SignUpScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector,useDispatch } from "react-redux";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import { UpdateUser } from "../../../redux/reducers/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Alias = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState("");

  const userData = useSelector(state => state.user.user);
  const token = useSelector((state) => state?.user?.AuthToken);

  const dispatch = useDispatch();
  console.log(token);



  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name:  "",
      displayName: "",
    },
  });

  const onSubmit = async (data) => {
    UpdateProfile.mutate(data);
    return;
  };

  const UpdateProfile = useMutation({
    mutationFn: (data) => {
      console.log("2222222---",data)
      return axios.post(
        "users/update_profile", {
          alias: data.name,
          alias_name: data.displayName,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
    },
  });

  const getPermissionAsync = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
    }
  };
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };


 const storeToke= async()=>{
    try {
      await AsyncStorage.setItem('userToken', "true");
      navigation.navigate("Home")
    } catch (error) {
      console.error('Error storing token: ', error);
    }   
  }
  useEffect(() => {
    getPermissionAsync();
  }, []);

  useEffect(()=>{
    if (UpdateProfile.isError) {
      console.log("error", UpdateProfile.error);
      Alert.alert("Something went wrong!");
      UpdateProfile.reset();
  } else if (UpdateProfile.isSuccess) {
      console.log(UpdateProfile.data.data);
      if (UpdateProfile.data?.data?.status == 0) {
          var message = "Unable to login!";
          if (UpdateProfile.data?.data?.message) {
              message = UpdateProfile.data?.data?.message;
          }
          Alert.alert(message);
          UpdateProfile.reset();
      } else {
          var message = "update Successfully!";
          if (UpdateProfile.data?.data?.message) {
              message = UpdateProfile.data?.data?.message;
          }
          console.log("alis---",UpdateProfile?.data?.data)
          Alert.alert(message);
          UpdateProfile.reset();
          storeToke()

      }
  }
  })
  // if (UpdateProfile.isSuccess) {
  //   console.log("alias-----", UpdateProfile.data?.data);
  //   Alert.alert(UpdateProfile.data?.data?.message);
  //   // dispatch(UpdateUser({user : UpdateProfile.data?.data?.info}));
  //   UpdateProfile.reset();
  //   navigation.navigate("Home")
  // }

  // if (UpdateProfile.isError) {
  //   Alert.alert("Something went wrong!");
  //   // console.log("error", UpdateProfile.error);
  //   UpdateProfile.reset();
  // }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {console.log("userData---",userData)}
          <View>
            <TouchableOpacity
              onPress={pickImage}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 30,
              }}
            >
              <TouchableOpacity onPress={() => navigation.navigate("Care")}>
                <Image
                  source={require("../../../../assets/back.png")}
                  resizeMode="contain"
                  style={styles.imageStyleBack}
                />
              </TouchableOpacity>
              <Text style={styles.title}>Alias</Text>
            </TouchableOpacity>

            <View style={{ alignItems: "center", marginTop: 50 }}>
              <View
                style={{
                  backgroundColor: "#F3F3F3",
                  padding: 50,
                  borderRadius: 100,
                  width: 120,
                  height: 120,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={
                    selectedImage == ""
                      ? require("../../../../assets/user-circle.png")
                      : { uri: selectedImage }
                  }
                  resizeMode="cover"
                  style={{ width: 60, height: 60, borderRadius: 100 }}
                />
                <Image
                  source={require("../../../../assets/cloud.png")}
                  resizeMode="contain"
                  style={{
                    position: "absolute",
                    width: 20,
                    height: 20,
                    bottom: 11,
                    right: 6,
                  }}
                />
              </View>
            </View>
            <Text style={styles.labelStyle}>Alias</Text>
            <View style={[styles.inputView, { color: "black" }]}>
              <Image
                source={require("../../../../assets/tag.png")}
                resizeMode="contain"
                style={styles.imageStyle}
              />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    placeholder="ironman"
                    onChangeText={(value) => onChange(value)}
                    value={value}
                  />
                )}
                name="name"
                rules={{
                  required: "Alias is required!",
                }}
              />
            </View>
            {errors.name && <Text style={styles.error} >{errors.name.message}</Text>}

            <Text style={styles.labelStyle}>Display Name</Text>
            <View style={[styles.inputView, { color: "black" }]}>
              <Image
                source={require("../../../../assets/usericon.png")}
                resizeMode="contain"
                style={styles.imageStyle}
              />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    placeholder="Iron Man"
                    onChangeText={(value) => onChange(value)}
                    value={value}
                  />
                )}
                name="displayName"
                rules={{
                  required: "Display name is required!",
                }}
              />
            </View>
            {errors.displayName && <Text style={styles.error} >{errors.displayName.message}</Text>}
          </View>
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              style={{
                backgroundColor: "#E7651C",
                padding: 15,
                borderRadius: 8,
                marginBottom: 10,
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                {UpdateProfile.isPending ? (
                  <ActivityIndicator color={"#ffffff"} ></ActivityIndicator>
                ) : (
                  <>
                    <Text
                      style={{
                        textAlign: "center",
                        color: "white",
                        marginRight: 5,
                      }}
                    >
                      Save to Continue
                    </Text>
                    <Image
                      source={require("../../../../assets/next.png")}
                      resizeMode="contain"
                      style={styles.imageStyle}
                    />
                  </>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async() =>{
                navigation.navigate("Home")           
              }}
              style={{
                padding: 15,
                borderRadius: 8,
                marginBottom: 10,
                borderColor: "#E7651C",
              }}
            >
              <Text style={{ textAlign: "center", color: "#E7651C" }}>
                Skip Alias creation for now
              </Text>
            </TouchableOpacity>

            <View
              style={{ alignItems: "center", marginTop: 2, marginBottom: 10 }}
            >
              <View
                style={{
                  backgroundColor: "#E7651C",
                  padding: 10,
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../../../../assets/logo.png")}
                  style={{ width: 15, height: 15 }}
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    flex: 0.9,
    textAlign: "center",
    color: "#000000",
  },
  input: {
    height: 40,
    flex: 1,
    borderWidth: 0,
    marginLeft: 5,
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
  inputViewCoutry: {
    flexDirection: "row",
    alignItems: "center",
    height: 55,
    backgroundColor: "#F3F3F3",
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  imageStyle: {
    width: 20,
    height: 20,
  },
  labelStyle: {
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
    marginTop: 20,
  },
  countryPicker: {
    backgroundColor: "#F3F3F3",
  },
  imageStyleBack: {
    width: 40,
    height: 40,
  },
  error: {
    color: "red"
  }
});

export default Alias;
