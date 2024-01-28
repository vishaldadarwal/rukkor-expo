// SignUpScreen.js
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const ProfileSetup = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>Set up your profiles</Text>
            <Text style={styles.subtitleStyle}>
              A Rukkor account is associated with two profiles, one which we
              call Real ID and one which is your Alias. You choose in which
              settings you wish to expose your true identity and in which you
              wish to use an alias.
            </Text>
          </View>
          <View
            style={styles.tileVeiw}
          >
            <View style={{}}>
              <Text style={styles.labelStyle1}>Real ID</Text>
              <View style={styles.imageView}>
                <Image
                  source={require("../../../../assets/user-shield.png")}
                  resizeMode="contain"
                  style={styles.imageStyleIcon}
                />
              </View>
            </View>
            <Text style={styles.subtitleStyle1}>
              With Real ID you can disclose your personal details like name,
              phone number, birthday, e-mail and more. Use your Real ID when
              interacting with trusted family, friends and colleagues.
            </Text>
          </View>


          <View
            style={styles.tileVeiw}
          >
            <View style={{}}>
              <Text style={styles.labelStyle1}>Alias</Text>
              <View style={styles.imageView}>
                <Image
                  source={require("../../../../assets/user-tag.png")}
                  resizeMode="contain"
                  style={styles.imageStyleIcon}
                />
              </View>
            </View>
            <Text style={styles.subtitleStyle1}>
              Using your Alias you can choose an additional @alias with which
              you can join Spaces and interact with other users in communities
              where you’re not comfortable sharing your personal details.
            </Text>
          </View>

          <View style={styles.buttonView}>
            <TouchableOpacity
              onPress={() => navigation.navigate("RealId")}
              style={{
                backgroundColor: "#E7651C",
                padding: 15,
                borderRadius: 8,
                marginBottom: 10,
                alignItems: "center"
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    marginRight: 5
                  }}
                >
                  Next
                </Text>
                <Image
                  source={require("../../../../assets/next.png")}
                  resizeMode="contain"
                  style={styles.imageStyle}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{ alignItems: "center", marginTop: 2, marginBottom: 10 }}
            >
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between"
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
    marginTop: 50,
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
    backgroundColor: "#F3F3F3"
  },
  inputView: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 55,
    backgroundColor: "#F3F3F3",
    paddingHorizontal: 10,
    borderRadius: 8
  },
  imageStyle: {
    width: 20,
    height: 20
  },
  labelStyle: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 30
  },
  labelStyle1: {
    marginTop: 10,
    fontSize: 21,
    color: "#000",
    textAlign: "center",
    marginTop: 20
  },
  subtitleStyle: {
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
    marginTop: 30
  },
  subtitleStyle1: {
    fontSize: 14,
    color: "#000",
    flex: 1,
    padding: 20,
    flexWrap: "wrap"
  },
  imageStyleIcon: {
    width: 30,
    height: 30
  },
  imageView: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 100,
    marginTop: 10
  },
  safeArea: { flex: 1, backgroundColor: "#ffffff" },
  tileVeiw: {
    flexDirection: "row",
    backgroundColor: "#F3F3F3",
    padding: 20,
    borderRadius: 10,
    marginTop: 20
  },
  bottomLogo:{
    backgroundColor: "#E7651C",
    padding: 10,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomLogoImg:{ width: 15, height: 15 },
  buttonView:{ flex: 1, justifyContent: "flex-end", marginTop: 10,marginBottom:50 },

});

export default ProfileSetup;