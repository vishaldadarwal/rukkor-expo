// SignUpScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, Platform, SafeAreaView, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DateTimePicker from '@react-native-community/datetimepicker';
// import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { setProfileData } from '../../../redux/reducers/user';





const Care = ({ navigation }) => {
    const userData = useSelector(state => state?.user?.user);
    const token = useSelector((state) => state?.user?.AuthToken);
    const userBasicData = useSelector(state => state?.user?.userProfile?.info);
    const userId = userData?.id;
    const [dateString, setDateString] = useState(moment(new Date()).format('YYYYMMDD'));
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const [year, setYear] = useState(moment(new Date()).format('YYYY'));
    const [month, setMonth] = useState(moment(new Date()).format('MM'));
    const [day, setDay] = useState(moment(new Date()).format('DD'));

    const dispatch = useDispatch();

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
                console.log("careapi---",getProfileQuery.data)
                var payload = {
                    userProfile: getProfileQuery.data
                }
                dispatch(setProfileData(payload))
                // Alert.alert(message);
            }
        }
    }, [getProfileQuery])

    const onChange = (event, selectedDate) => {
        setDateString(moment(selectedDate).format('YYYYMMDD'));
        setDate(selectedDate);
        const formattedDate = moment(selectedDate);
        setYear(formattedDate.format('YYYY'));
        setMonth(formattedDate.format('MM'));
        setDay(formattedDate.format('DD'));
        setShow(false)
    };
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
            work: userBasicData?.work_place,
            role: userBasicData?.work_role,
        },
    });
    const showOverlay = () => {
        setShow(true);
    };
    const onSubmit = async (data) => {
        console.log("data--", data);
        CareMutation.mutate(data);
        return;
    };

    const CareMutation = useMutation({
        mutationFn: (data) => {
            return axios.post("users/update_profile", {
                work_place: data.work,
                work_role: data.role,
                dob: dateString,
            }, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
        },
    });

    useEffect(() => {
        if (CareMutation.isError) {
            console.log("error", CareMutation.error);
            Alert.alert("Something went wrong!");
            CareMutation.reset();
        } else if (CareMutation.isSuccess) {
            console.log(CareMutation.data.data);
            if (CareMutation.data?.data?.status == 0) {
                var message = "Unable to login!";
                if (CareMutation.data?.data?.message) {
                    message = CareMutation.data?.data?.message;
                }
                Alert.alert(message);
                CareMutation.reset();
            } else {
                var message = "Register Successfully!";
                if (CareMutation.data?.data?.message) {
                    message = CareMutation.data?.data?.message;
                }
                Alert.alert(message);
                CareMutation.reset();
                navigation.navigate("Alias")

            }
        }
    }, [CareMutation]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }} >
            <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}  >
                <View style={styles.container}>
                {/* {console.log("care---", userBasicData)} */}
                    {getProfileQuery.isLoading && <View style={[styles.loader]}>
                        <ActivityIndicator size="large" color="#E7651C" />
                    </View>}
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 30 }} >
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Image source={require('../../../../assets/back.png')} resizeMode='contain' style={styles.imageStyleBack} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Care to share?</Text>
                    </View>

                    <View style={{ alignItems: "center", marginTop: 50 }} >
                        <Text style={styles.subtitleStyle1}>Care to share some more about yourself? This information will be available in your Real ID profile. It will be shared with other users should you choose to show them your Real ID.</Text>
                    </View>
                    <Text style={styles.labelStyle}>Where do you work?</Text>
                    <View style={styles.inputView} >
                        <Image source={require('../../../../assets/ind.png')} resizeMode='contain' style={styles.imageStyle} />
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    placeholder="Stark Industries"
                                    onChangeText={(value) => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="work"
                        // rules={{
                        // required: "work is required!",
                        // }}
                        />
                    </View>

                    <Text style={styles.labelStyle}>What’s your title/role?</Text>
                    <View style={styles.inputView} >
                        <Image source={require('../../../../assets/officer.png')} resizeMode='contain' style={styles.imageStyle} />
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    onBlur={onBlur}
                                    placeholder="Chief Executive Officer"
                                    onChangeText={(value) => onChange(value)}
                                    value={value}
                                />
                            )}
                            name="role"
                        // rules={{
                        // required: "work is required!",
                        // }}
                        />
                    </View>

                    <Text style={styles.labelStyle}>When’s your birthday?</Text>

                    <View style={{ flex: 1, justifyContent: "space-between", flexDirection: "row" }} >
                        <View style={{ width: "30%" }}>
                            <Text style={styles.labelStyleDate}>Year</Text>
                            <TouchableOpacity onPress={() => showOverlay()} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", height: 55, backgroundColor: '#F3F3F3', paddingHorizontal: 10, borderRadius: 8, }} >
                                <TextInput
                                    value={year}
                                    style={{}}
                                    editable={false}
                                />
                                <Image source={require('../../../../assets/downArrow.png')} resizeMode='contain' style={styles.imageStyle} />
                            </TouchableOpacity>
                        </View>


                        <View style={{ width: "30%" }}>
                            <Text style={styles.labelStyleDate}>Month</Text>
                            <TouchableOpacity onPress={() => showOverlay()} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", height: 55, backgroundColor: '#F3F3F3', paddingHorizontal: 10, borderRadius: 8, }} >
                                <TextInput
                                    value={month}
                                    style={{}}
                                    editable={false}
                                />
                                <Image source={require('../../../../assets/downArrow.png')} resizeMode='contain' style={styles.imageStyle} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: "30%" }}>
                            <Text style={styles.labelStyleDate}>Day</Text>
                            <TouchableOpacity onPress={() => showOverlay()} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", height: 55, backgroundColor: '#F3F3F3', paddingHorizontal: 10, borderRadius: 8, }} >
                                <TextInput
                                    value={day}
                                    style={{}}
                                    editable={false}
                                />
                                <Image source={require('../../../../assets/downArrow.png')} resizeMode='contain' style={styles.imageStyle} />
                            </TouchableOpacity>
                        </View>


                    </View>
                    <View style={{ flex: 1, borderRadius: 100 }}>
                        {show &&
                            <DateTimePicker
                                value={date}
                                mode={'date'}
                                is24Hour={true}
                                display="default"
                                onChange={onChange}
                                style={{ backgroundColor: 'white' }}
                                maximumDate={new Date()}
                            />
                        }
                    </View>

                    <View style={{ flex: 1, justifyContent: "flex-end" }}>
                        <TouchableOpacity
                            onPress={handleSubmit(onSubmit)}
                            // onPress={() => navigation.navigate('Alias')
                            style={{ backgroundColor: "#E7651C", padding: 15, borderRadius: 8, marginBottom: 10, alignItems: "center", marginTop: 10 }}
                        >
                            <View style={{ flexDirection: "row" }} >
                                {CareMutation.isPending ? (
                                    <ActivityIndicator color={"#ffffff"} ></ActivityIndicator>
                                ) : (
                                    <>
                                        <Text style={{ textAlign: "center", color: "white", marginRight: 5 }}>Save to Continue</Text>
                                        <Image source={require('../../../../assets/next.png')} resizeMode='contain' style={styles.imageStyle} />
                                    </>
                                )}

                            </View>
                        </TouchableOpacity>

                        <View style={{ alignItems: "center", marginTop: 2, marginBottom: 10 }} >
                            <View style={{ backgroundColor: "#E7651C", padding: 10, borderRadius: 100, alignItems: 'center', justifyContent: "center" }} >
                                <Image source={require('../../../../assets/logo.png')} style={{ width: 15, height: 15 }} />
                            </View>
                        </View>
                    </View>

                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}
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
    labelStyle1:{      
        fontSize: 14, color: '#000', marginBottom: 8, marginTop: 5
    }, 
    countryPicker: {
        backgroundColor: "#F3F3F3",  
    },
    
    subtitleStyle1: {
        fontSize: 14, color: '#000', flex: 1, textAlign: "justify",
    },
    overlayStyle: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
        backgroundColor: '#00000066',
    },
    headerStyle: {
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderColor: '#CDCDCD',
        borderBottomWidth: 1,
        height: 50,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    inputContainerStyle: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#CAD3DF',
        borderRadius: 5,
        marginVertical: 10,
        marginHorizontal: 10,
        paddingRight: 10,
        height: 50,
    },
    placeholderStyle: {
        fontFamily: 'Gill Sans',
        fontSize: 16,
        color: '#CDCDCD',
        marginHorizontal: 10,
    },
    textStyle: {
        fontFamily: 'Gill Sans',
        fontSize: 16,
        marginHorizontal: 10,
    },
    imageStyleBack: {
        width: 40,
        height: 40,
      },
});

export default Care;