import { StatusBar } from 'expo-status-bar';
import {  Text, View,Image,StyleSheet } from 'react-native';
import logo from '../../../assets/Logo_biat_2019.jpg'
import Custombutton from '../../components/custom_button/Custombutton';
import Custom_input from '../../components/Custom_input';
import Reset from '../resetPassword_screen/reset';
import Confirm_screen from '../confirm_screen';

import { Button } from 'react-native';
import { Link } from "expo-router";

import { useWindowDimensions,Alert } from 'react-native';
import { useState } from 'react';
import ConfirmSign from '../confirm_screen/confirm';
import { Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm,Controller} from 'react-hook-form';
import { TextInput } from 'react-native';
import { Auth } from 'aws-amplify';
import Postlog from '../../../chat/postlog';
import AWS from 'aws-sdk/dist/aws-sdk-react-native'
import UserPage from '../../../chat/user_menu';
import App from '../../../chat/postlog';







export default function Sign() {
  const router = useRouter() // import useRouter hook from Next.js for client-side navigation
  const [username, setUsername] = useState('') // initialize state variables for username and password
  const [password, setPassword] = useState('')
  const { height } = useWindowDimensions() // import useWindowDimensions hook from React Native to get window dimensions
  const [loading, setLoading] = useState(false) // initialize state variable for loading state
  const { control, handleSubmit, formState: { errors } } = useForm() // import useForm hook from react-hook-form library for form handling
  console.log(errors) // log any errors to the console for debugging
  const cognito = new AWS.CognitoIdentityServiceProvider() // initialize AWS CognitoIdentityServiceProvider to interact with the Amazon Cognito service
  const onSignPressed = async (data) => { // function to handle sign-in button press
    if (loading) { // if a sign-in attempt is already in progress, return
      return;
    }
    setLoading(true) // set loading state to true
    try { // attempt to sign in using the AWS Auth module
      const response = await Auth.signIn(data.username.toLowerCase(), data.password)
    }
    catch (e) { // handle errors that may occur during sign-in attempt
      if (e.message == 'User is not confirmed.') { // if user account is not confirmed, display an error message and navigate to the confirmation screen
        Alert.alert('error', 'to sign in you need to confirm your account ')
        router.push('./authentification/screens/confirm_screen/confirm')
      }
      else if (e.message == 'Network error') { // if there is a network error, display an error message
        Alert.alert('error', 'Network error')
      }
      else { // if the user does not exist or the password is incorrect, display an error message
        Alert.alert('error', 'user does not exist or wrong password')
      }
    }
    setLoading(false) // set loading state back to false after the sign-in attempt is complete
  }
  const onForgotPassword = async () => { // function to handle forgot password button press
    router.push("./authentification/screens/resetPassword_screen/reset") // navigate to the reset password screen
  }
  const onNewAccount = () => { // function to handle create account button press
    router.push("./authentification/screens/signup_screen/signup") // navigate to the sign-up screen
  }

  const onSignGoogle = () => { // function to handle sign in with Google button press
    console.warn('Google')
  }
  const onSignFacebook = () => { // function to handle sign in with Facebook button press
    console.warn('Facebook')
  }
  const onSignApple = () => { // function to handle sign in with Apple button press
    console.warn('Apple')
  }
  
      

  // render the sign-in screen with custom input and button components
  return (
      <View style={styles.root}>

        <Image source={logo}
         style={[styles.logo,
         {height:height*0.3}]} 
         /> 

       <Custom_input 
        name_='username'
        control={control}
        placeholder='Username'
        rules={{required :'username is required'}} 
        username={username} 
        
        />
        
        <Custom_input 
        name_='password'
        control={control}
        placeholder='Password'
        rules={{required :'password is required',minLength:{value:6 ,message:'password should be minimum 6 caracters long'}}}
        username={password} 
        
        secureTextEntry={true}
         /> 
         
       
         
        
        <Custombutton
        onPress={handleSubmit(onSignPressed)}
        text={loading? 'Loading...': 'Sign in'}
        
        />
      
       
          
         <Custombutton
        onPress={onForgotPassword}
        text='Forgot password ?'
        type='TERITIARY'
        
        />
       
       
        
     
        
       
       <Custombutton
        onPress={onNewAccount}
        text="Don't have an account ? Create one "
        type='TERITIARY'
        />
       
    


        
        
        
        
        <StatusBar style="auto" />
      </View>
    );}
    const styles = StyleSheet.create({
      root:{
        flex: 1,
    alignItems: 'center',
    padding:20,
    marginVertical:20


      },

      logo: {
        height:80,
        width:130,
        resizeMode: 'contain',
        maxHeight:100,
        
       
        marginTop: 100,
        marginBottom:40
      },
    })

  

