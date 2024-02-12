import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

const CustomButton = ({ onPress, isPending, buttonText }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.submitButton}>
      {isPending ? (
        <ActivityIndicator color={"#ffffff"} animating={isPending} />
      ) : (
        <Text style={{ textAlign: "center", color: "white" }}>{buttonText}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    submitButton:{
        backgroundColor: "#E7651C",
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        height: 48
      },
});

export default CustomButton;
