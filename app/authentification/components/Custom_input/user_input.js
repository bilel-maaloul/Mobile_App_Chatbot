import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Controller } from 'react-hook-form';

// Define a React component called "SignTemplate" that renders a styled text input field
// using React Native's "TextInput" component. It uses the "Controller" component from the
// "react-hook-form" library to handle the form's state and validation.
const SignTemplate = ({name_,control,placeholder,rules={},secureTextEntry}) => {
 
  return (
    // Use the "Controller" component to connect the text input field to the form's state
    // and validation rules.
    <Controller
      control={control}
      name={name_}
      rules={rules}
      render={({field:{value,onChange,onBlur},fieldState:{error}})=>(
        <>
          {/* Render a styled container for the text input field */}
          <View style={[styles.container,{borderColor:error?'red':'#e8e8e8'}]}>
            {/* Render the text input field */}
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              secureTextEntry={secureTextEntry}
              style={styles.input}
            /> 
          </View>
          {/* If there is an error with the field's value, render an error message */}
          {error &&
            <Text style={{color:'red' ,alignSelf:'stretch'}}> {error.message ||'ERROR'} </Text>
          }
        </>
      )}
    />  
  );
};

// Define a stylesheet for the "SignTemplate" component
const styles = StyleSheet.create({
  container: {
    backgroundColor:'white',
    width:'90%',
    height:40,
    borderColor:'#e8e8e8',
    borderWidth:1,
    borderRadius:20,
    paddingHorizontal:10,
    marginVertical:8,
    borderWidth: 3
  },
  input:{}
});

// Export the "SignTemplate" component as the default export of this module
export default SignTemplate;
