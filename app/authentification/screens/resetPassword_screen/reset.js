import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, StyleSheet } from 'react-native';
import Custombutton from '../../components/custom_button/Custombutton';
import Custom_input from '../../components/Custom_input';
import { Button } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useState } from 'react';
import { Link } from "expo-router";
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import newpass from '../newPassword_screen/newpass';
import { Auth } from 'aws-amplify';
import { Alert } from 'react-native';
import img from 'biat_bot/app/assets/bgmosaique2.png'
import { ImageBackground } from 'react-native';

// define the reset function component
const reset = () => {
  // set initial state values for username, code, email, password, and repeatPassword
  const [username, setUsername] = useState('')
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setPasswordRepeat] = useState('')
  
  // destructure control, handleSubmit, and errors from useForm hook
  const { control, handleSubmit, formState: { errors } } = useForm()
  
  // initialize useRouter hook
  const router = useRouter()

  // define onBackSignIn function to navigate back to Sign In screen
  const onBackSignIn = () => {
    router.back()
  }

  // define onSignPressed function (currently just logs to console)
  const onSignPressed = () => {
    console.warn('pressed')
  }

  // define onForgotPassword function (currently just logs to console)
  const onForgotPassword = () => {
    console.warn('forgot password')
  }

  // define onRegister function (currently just logs to console)
  const onRegister = () => {
    console.warn('forgot password')
  }

  // define onNewPassword function to handle submitting the reset password form
  const onNewPassword = async (data) => {
    try {
      // call Auth.forgotPassword API with entered username
      const response = await Auth.forgotPassword(data.username.toLowerCase())
      // navigate to New Password screen
      router.push("../newPassword_screen/newpass")
    }
    catch (e) {
      // if there is a network error, display an error message
      if (e.message == 'Network error') {
        Alert.alert('error', 'Network error')
      }
      // if the user does not exist, display an error message
      else
        Alert.alert('error', 'user does not exist')

    }
  }

  // render the reset password form with Custom_input and Custombutton components
  return (
  
  
      <ImageBackground source={img} style={styles.background}> 
      <View style={styles.root}>

        <Text style={styles.title}> Reset your password </Text>

        
        <Custom_input 
        name_='username'
        control={control}
        placeholder='Username'
        rules={{required :'username is required'}} 
        username={username} 
        
        />

      
       
        <Custombutton
        onPress={handleSubmit(onNewPassword)}
        text='send'
        />
        
        
       
         <Custombutton
        onPress={onBackSignIn}
        text='Back to Sign in'
        type='TERITIARY'
        
        />
        
        
        
        
        
        
        <StatusBar style="auto" />
      </View>
      </ImageBackground >
    );}
    const styles = StyleSheet.create({
      background:{ flex: 1,
        resizeMode: 'stretch',
        
      
      height:'140%',
      width:'100%'
      
    },
      root:{
        flex: 1,
    alignItems: 'center',
    padding:20,
    marginVertical:20
      },

     
      title:{
           fontSize:24,
           fontWeight:'bold',
           color:'#051C60',
           margin:20
      },
      text:{
        color:'gray',
        marginVertical:10,
      },
      link:{
        color:'#FDB075'

      }

    })

  
  export default reset