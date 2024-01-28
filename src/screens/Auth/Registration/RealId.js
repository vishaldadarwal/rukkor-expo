// SignUpScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, Dimensions, Modal, ScrollView, TextComponent } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// import CountryPicker from 'react-native-country-picker-modal';
import * as ImagePicker from 'expo-image-picker';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { setProfileData } from '../../../redux/reducers/user';



const RealId = ({ navigation }) => {
    const userData = useSelector(state => state.user.user);
    const token = useSelector((state) => state?.user?.AuthToken);
    const userBasicData = useSelector(state => state.user?.userProfile?.info);

    const userId = userData?.id;
    const [email, setEmail] = useState(userData?.primary_email);

    const [countryCode, setCountryCode] = useState('US');
    // const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedImage, setSelectedImage] = useState("");
    const [callCode, setCallcode] = useState('+1');
    // const [selectedLanguage, setSelectedLanguage] = useState("English");
    const [modalVisible, setModalVisible] = useState(false);
    const [countryData, setCountryData] = useState([])
    const [currentIndex, setCurrentIndex] = useState(null)


    const dispatch = useDispatch();

    const fetchCountryData = async () => {
        const response = await axios.get("users/get_country", {
            // headers: {
            //     Authorization: 'Bearer ' + token,
            // },
        });
        return response.data;
    };

    const getCountryQuery = useQuery({
        queryFn: () => fetchCountryData(),
        queryKey: ["getCountryData"]
    });

    useEffect(() => {
        if (getCountryQuery.isError) {
            console.log("error", getCountryQuery.error);
            Alert.alert("Something went wrong!");
        } else if (getCountryQuery.isSuccess) {
            // console.log(getCountryQuery.data);
            if (getCountryQuery.data?.status == 0) {
                var message = "Unable to fetching data!";
                if (getCountryQuery, data.message) {
                    message = getCountryQuery.data.message;
                }
                Alert.alert(message);
            } else {
                var message = "Register Successfully!";
                if (getCountryQuery.data.message) {
                    message = getCountryQuery.data.message;
                }
                setCountryData(getCountryQuery?.data?.info)
                // console.log("last---",getCountryQuery.data)
                // var payload = {
                //     userProfile: getCountryQuery.data
                // }
                // dispatch(setProfileData(payload))
                // Alert.alert(message);
            }
        }
    }, [getCountryQuery])

    const fetchUserData = async (userId, token) => {
        // console.log("prams---",userId, token)
        const response = await axios.get(`users/get_user_profile?user_id=${userId}`, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });
        return response.data;
    };

    const getProfileQuery = useQuery({
        queryFn: () => fetchUserData(userId, token),
        queryKey: ["getUserData"]
    });


    useEffect(() => {
        // console.log("getProfileQuery---",userProfile ,isLoading, isError)
        if (getProfileQuery.isError) {
            console.log("error", getProfileQuery.error);
            Alert.alert("Something went wrong!");
        } else if (getProfileQuery.isSuccess) {
            console.log(getProfileQuery.data);
            if (getProfileQuery.data?.status == 0) {
                var message = "Unable to fetching data!";
                if (getProfileQuery, data.message) {
                    message = getProfileQuery.data.message;
                }
                Alert.alert(message);
            } else {
                var message = "Register Successfully!";
                if (getProfileQuery.data.message) {
                    message = getProfileQuery.data.message;
                }
                // console.log("last---",getProfileQuery.data)
                var payload = {
                    userProfile: getProfileQuery.data
                }
                dispatch(setProfileData(payload))
                // Alert.alert(message);
            }
        }
    }, [getProfileQuery])

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
            userName: userBasicData?.username,
            firstName: userBasicData?.first_name,
            lastName: userBasicData?.last_name,
            // phoneNumber: userBasicData?.mobile,
        },
    });

    const onSubmit = async (data) => {
        console.log("data--", data);
        RealIdMutation.mutate(data);
        return;
    };

    const RealIdMutation = useMutation({
        mutationFn: (data) => {
            return axios.post("users/update_profile", {
                username: data.userName,
                first_name: data.firstName,
                last_name: data.lastName,
                // mobile: data.phoneNumber,
            }, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
        },
    });

    useEffect(() => {
        if (RealIdMutation.isError) {
            console.log("error", RealIdMutation.error);
            Alert.alert("Something went wrong!");
            RealIdMutation.reset();
        } else if (RealIdMutation.isSuccess) {
            console.log(RealIdMutation.data.data);
            if (RealIdMutation.data?.data?.status == 0) {
                var message = "Unable to login!";
                if (RealIdMutation.data?.data?.message) {
                    message = RealIdMutation.data?.data?.message;
                }
                Alert.alert(message);
                RealIdMutation.reset();
            } else {
                var message = "Register Successfully!";
                if (RealIdMutation.data?.data?.message) {
                    message = RealIdMutation.data?.data?.message;
                }
                Alert.alert(message);
                RealIdMutation.reset();

                navigation.navigate("Care")
            }
        }
    }, [RealIdMutation]);

    useEffect(() => {

        getPermissionAsync();
    }, [])


    const getPermissionAsync = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access media library is required!');
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
            setSelectedImage(result.assets[0].uri)
        }
    };


    const renderItem = (data, index) => (
        <TouchableOpacity
            key={data?.value}
            onPress={() => {
                setCallcode("+" + data?.callingCodes[0]);
                setCurrentIndex(index)
                setModalVisible(false);
            }}
            style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc', flexDirection: "row", justifyContent: "space-between" }}
        >
            <Text style={{ fontSize: 16, color: currentIndex == index ? "#E7651C" : "#000000" }}>{"+" + data?.callingCodes[0]}</Text>
            <Text style={{ fontSize: 16, color: currentIndex == index ? "#E7651C" : "#000000" }}>{data?.name}</Text>
        </TouchableOpacity>
    );
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }} >
            {/* {console.log("realid--", userBasicData)} */}
            <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    {getProfileQuery.isLoading && <View style={[styles.loader]}>
                        <ActivityIndicator size="large" color="#E7651C" />
                    </View>}
                    <View>
                        <Text style={styles.title}>Real ID</Text>
                        <TouchableOpacity onPress={pickImage} style={{ alignItems: "center", marginTop: 50 }} >
                            <View style={{ backgroundColor: "#F3F3F3", padding: 50, borderRadius: 100, width: 120, height: 120, alignItems: 'center', justifyContent: "center" }} >
                                <Image source={selectedImage == "" ? require('../../../../assets/user-circle.png') : { uri: selectedImage }} resizeMode="cover" style={{ width: 60, height: 60, borderRadius: 100 }} />
                                <Image source={require('../../../../assets/cloud.png')} resizeMode="contain" style={{ position: "absolute", width: 20, height: 20, bottom: 11, right: 6 }} />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.labelStyle}>E-mail</Text>
                        <View style={[styles.inputView, { backgroundColor: "#999999" }]} >
                            <Image source={require('../../../../assets/email.png')} resizeMode='contain' style={styles.imageStyle} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your e-mail"
                                value={email}
                                editable={false}
                            />
                        </View>
                        <Text style={styles.labelStyle}>Username *</Text>

                        <View style={styles.inputView} >
                            <Image source={require('../../../../assets/tag.png')} resizeMode='contain' style={styles.imageStyle} />
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={styles.input}
                                        onBlur={onBlur}
                                        placeholder="tony_stark"
                                        onChangeText={(value) => onChange(value)}
                                        value={value}
                                    />
                                )}
                                name="userName"
                                rules={{
                                    required: "Username is required!",
                                    pattern: {
                                        value: /^[a-zA-Z0-9_]{3,15}$/,
                                        message: "Invalid username",
                                    },
                                }}
                            />
                        </View>
                        {errors.userName && <Text style={styles.error} >{errors.userName.message}</Text>}


                        <Text style={styles.labelStyle}>First name *</Text>
                        <View style={styles.inputView} >
                            <Image source={require('../../../../assets/usericon.png')} resizeMode='contain' style={styles.imageStyle} />
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={styles.input}
                                        onBlur={onBlur}
                                        placeholder="Tony"
                                        onChangeText={(value) => onChange(value)}
                                        value={value}
                                    />
                                )}
                                name="firstName"
                                rules={{
                                    required: "Enter first name!",
                                    // pattern: {
                                    //     value: "",
                                    //     message: "Enter first name!",
                                    // },
                                }}
                            />
                        </View>
                        {errors.firstName && <Text style={styles.error} >{errors.firstName.message}</Text>}

                        <Text style={styles.labelStyle}>Last name *</Text>
                        <View style={styles.inputView} >
                            <Image source={require('../../../../assets/usericon.png')} resizeMode='contain' style={styles.imageStyle} />
                            <Controller
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={styles.input}
                                        onBlur={onBlur}
                                        placeholder="Stark"
                                        onChangeText={(value) => onChange(value)}
                                        value={value}
                                    />
                                )}
                                name="lastName"
                                rules={{
                                    required: "Enter last name!",
                                    // pattern: {
                                    //     value: "",
                                    //     message: "Enter first name!",
                                    // },
                                }}
                            />
                        </View>
                        {errors.lastName && <Text style={styles.error} >{errors.lastName.message}</Text>}

                        <Text style={styles.labelStyle}>Country</Text>
                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.inputViewCoutry}>
                                <Image source={require('../../../../assets/lang.png')} resizeMode='contain' style={styles.imageStyle} />
                                <Text> {callCode}</Text>
                                {/* <CountryPicker
                                    {...{
                                        countryCode,
                                        withFilter: true,
                                        withFlag: true,
                                        withAlphaFilter: true,
                                        onSelect: (country) => {
                                            setCallcode("+" + country.callingCode[0])
                                            setCountryCode(country.cca2)
                                        },
                                        containerButtonStyle: styles.countryPicker,
                                    }}
                                /> */}



                            </TouchableOpacity>

                            <View style={[styles.inputViewCoutry, { marginLeft: 10, flex: 1 }]} >
                                <Image source={require('../../../../assets/mobile.png')} resizeMode='contain' style={styles.imageStyle} />

                                <Controller
                                    control={control}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            style={styles.input}
                                            placeholder="xxx - xx xx xxx"
                                            keyboardType="phone-pad"
                                            value={value}
                                            onChangeText={(value) => onChange(value)}
                                            returnKeyType='Done'
                                        />
                                    )}
                                    name="phoneNumber"
                                    rules={{
                                        // required: "Enter phone no!",
                                        // pattern: {
                                        //     value: /^[2-9]\d{2}[2-9](?!11)\d{6}$/,
                                        //     message: "invaild number!",
                                        // },
                                    }}
                                />
                            </View>
                        </View>
                        {errors.phoneNumber && <Text style={styles.error} >{errors.phoneNumber.message}</Text>}

                    </View>

                    <View style={{ justifyContent: "flex-end", marginTop: 50 }}>
                        <TouchableOpacity
                            // onPress={() => navigation.navigate('Care')}
                            onPress={handleSubmit(onSubmit)}
                            style={{ backgroundColor: "#E7651C", padding: 15, borderRadius: 8, marginBottom: 10, alignItems: "center", marginTop: 10 }}
                        >
                            <View style={{ flexDirection: "row" }} >
                                {RealIdMutation.isPending ? (
                                    <ActivityIndicator color={"#ffffff"} ></ActivityIndicator>
                                ) : (
                                    <>
                                        <Text style={{ textAlign: "center", color: "white", marginRight: 5 }}>Save to Continue</Text>
                                        <Image source={require('../../../../assets/next.png')} resizeMode='contain' style={styles.imageStyle} />
                                    </>)}
                            </View>
                        </TouchableOpacity>

                        <View style={{ alignItems: "center", marginTop: 2, marginBottom: 10 }} >
                            <View style={{ backgroundColor: "#E7651C", padding: 10, borderRadius: 100, alignItems: 'center', justifyContent: "center" }} >
                                <Image source={require('../../../../assets/logo.png')} style={{ width: 15, height: 15 }} />
                            </View>
                        </View>
                    </View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.3)",
                            // maxHeight: "80%"
                        }}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={{
                            flex: 1,
                            backgroundColor: "rgba(0, 0, 0, 0.3)",

                            justifyContent: 'center', alignItems: 'center', borderRadius: 8
                        }}>
                            <View style={{ width: "80%", height: "80%", borderRadius: 8 }}>
                                <ScrollView>
                                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5 }}>
                                        {countryData.map(renderItem)}

                                    </View>
                                </ScrollView>
                                <TouchableOpacity
                                    onPress={() => setModalVisible(false)}
                                    style={{
                                        backgroundColor: "#E7651C",
                                        padding: 15,
                                        borderRadius: 8,
                                        marginBottom: 10,
                                        height: 48,
                                        marginTop:10
                                    }}
                                >
                                    <Text style={{ textAlign: "center", color: "white" }}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </KeyboardAwareScrollView>

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
        justifyContent: 'space-between',
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
        color: "#000000"
    },
    input: {
        height: 40,
        // width: 300,
        flex: 1,
        borderWidth: 0,
        // marginBottom: 16,
        // paddingHorizontal: 20,
        marginLeft: 5,
        // backgroundColor: '#F3F3F3',
    },
    inputView: {
        flexDirection: "row", alignItems: "center", width: '100%', height: 55, backgroundColor: '#F3F3F3', paddingHorizontal: 10, borderRadius: 8,
    },
    inputViewCoutry: {
        flexDirection: "row", alignItems: "center", height: 55, backgroundColor: '#F3F3F3', paddingHorizontal: 10, borderRadius: 8,
    },
    imageStyle: {
        width: 20, height: 20,
    },
    labelStyle: {
        fontSize: 14, color: '#000', marginBottom: 8, marginTop: 20
    },
    countryPicker: {
        backgroundColor: "#F3F3F3",
    },
    error: {
        color: "red"
    }
});

export default RealId;