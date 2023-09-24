import { StatusBar } from 'expo-status-bar';
import {  Text, View,Image,StyleSheet } from 'react-native';
import { ImageBackground } from 'react-native';

import Custombutton from '../../components/custom_button/Custombutton';
import Custom_input from '../../components/Custom_input';
import { Button } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useState } from 'react';
import { Link } from "expo-router";
import { useRouter } from 'expo-router';
import { useForm,Controller} from 'react-hook-form';
import { Auth } from 'aws-amplify';
import { Alert } from 'react-native';
import { useNavigation } from 'expo-router';
import img from 'biat_bot/app/assets/bgmosaique2.png'

const Signup=() =>{
  // Define state variables to hold input values
  const [username,setUsername]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const[repeatPassword,setPasswordRepeat]=useState('')
   
  // Import necessary hooks from libraries
  const router=useRouter()
  const {control,handleSubmit ,formState:{errors},watch}=useForm()

  // Define regular expression for email validation
  const Email= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  // Get the value of password input
  const pwd=watch('password')

  // Function to navigate back to sign in page
  const onBackSignIn=()=>{
    router.back()
  }

  // Function to handle user registration
  const onRegister=async(data)=>{
    try{
      const {username,password,email,name}=data
      const response=await Auth.signUp({username,password ,attributes:{email,name,preferred_username:name}})
      // If registration is successful, navigate to confirmation screen and show alert message
      router.push("../confirm_screen/confirm")
      Alert.alert('msg','a verification code was sent to your mail')
    }
    catch(e){
      // If an error occurs during registration, show alert message with error message
      Alert.alert('oops',e.message)
    }
  }
  
  // Function to handle forgot password button press
  const onForgotPassword=()=>{
    console.warn('forgot password')
  }

  // Functions to handle social sign in button press
  const onSignGoogle=()=>{
    console.warn('Google')
  }
  const onSignFacebook=()=>{
    console.warn('Facebook')
  }
  const onSignApple=()=>{
    console.warn('Apple')
  }

  // Functions to handle terms and privacy policy link press
  const onTerms=()=>{
    console.warn('terms')
  }
  const onPrivacy=()=>{
    console.warn('privacy')
  }
   // Render the sign up screen

    return (
      <ImageBackground source={img} style={styles.background}>

      
      <View style={styles.root}>

        <Text style={styles.title}> Create an account </Text>

         {/* Custom input components for name, username, email, password, and repeat password */}

        <Custom_input 
        name_='name'
        control={control}
        placeholder='name'
        rules={{required :'name is required',
        minLength:{value:3 ,message:'name should be minimum 3 caracters long'},
        maxLength:{value:12 ,message:'name should not surpass maximum 12 caracters'}}}
       
        username={username} 
        
        />
        <Custom_input 
        name_='username'
        control={control}
        placeholder='Username'
        rules={{required :'username is required',
        minLength:{value:6 ,message:'username should be minimum 3 caracters long'},
        maxLength:{value:24 ,message:'username should not surpass maximum 24 caracters'}}}
       
        username={username} 
        
        />

      <Custom_input 
        name_='email'
        control={control}
        placeholder='Email'
        rules={{required :'email is required',pattern:{value:Email,message:'Email is invalid'}}} 
        username={email} 
        
        />    
        
        <Custom_input 
        name_='password'
        control={control}
        placeholder='Password'
        rules={{required :'password is required',
        minLength:{value:8 ,message:'password should be minimum 8 caracters long'},
        maxLength:{value:16 ,message:'password should be maximum 16 caracters long'}}}
        username={password} 
        
        secureTextEntry={true}
         /> 

        <Custom_input 
        name_='repeatpassword'
        control={control}
        placeholder='Repeat password'
        rules={{validate :value=> value ==pwd || 'password does not match'}}
      
        username={repeatPassword} 
        
        secureTextEntry={true}
         /> 

      

        <Custombutton
        onPress={handleSubmit(onRegister)}
        text='Register'
        
        />

        <Text style={styles.text}>  
        By registering ,you cn confirm that you accept our {' '}
        <Text style={styles.link} onPress={onTerms}> Terms of Use </Text> and{' '}
        <Text style={styles.link} onPress={onPrivacy}> Privacy Policy </Text>
        </Text>
        
        
        { /*  <Custombutton
        onPress={onSignGoogle}
        text='Sign in with Google'
        bgColor='#FAE9EA'
        fgColor='#DD4D44'
        
        />
         <Custombutton
        onPress={onSignFacebook}
        text='Sign in with Facebook'
        bgColor='#E7EAF4'
        fgColor='#4765A9'
        
        />

         <Custombutton
        onPress={onSignApple}
        text='Sign in with Apple'
        bgColor='#e3e3e3'
        fgColor='#363636'
         />  */}
        
        
        
        <Custombutton
        onPress={onBackSignIn}
        text="Back to Sign in"
        type='TERITIARY'
        />
       
    


        
        
        
        
        <StatusBar style="auto" />
      </View>
      </ImageBackground>
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

  
  export default Signup
