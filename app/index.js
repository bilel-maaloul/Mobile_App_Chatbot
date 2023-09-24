import { ScrollView, StyleSheet, Text, View } from "react-native"
import Sign from "./authentification/screens/sign_screen/sign";
import { Link } from "expo-router";

import { NavigationContainer } from "@react-navigation/native";



import Sign_screen from "./authentification/screens/sign_screen";


import { withAuthenticator } from 'aws-amplify-react-native';
import { Amplify } from 'aws-amplify';

import { useEffect, useState,useRef } from "react";
import { Auth,Hub } from "aws-amplify";
import Chat from "./chat/postlog";
import { ImageBackground } from "react-native";
import img from './assets/bgmosaique2.png'
import UserMenu from "./chat/user_menu";
import menu from "./chat/menu";
import newpass from "./chat/newpass";

import ConfirmSign from "./authentification/screens/confirm_screen/confirm";
import React from "react";
import LoadingScreen from "./authentification/screens/loading_screen/loading_screen";









Amplify.configure({
  "aws_project_region": "us-east-1",
    "aws_cognito_identity_pool_id": "us-east-1:c4611e63-67c6-42ef-afe7-4c4cac6212ac",
    "aws_cognito_region": "us-east-1",
    "aws_user_pools_id": "us-east-1_hOrtfdZPk",
    "aws_user_pools_web_client_id": "7dembfr8n711njak0a3onq77sj",
    "oauth": {},
    "aws_cognito_username_attributes": [],
    "aws_cognito_social_providers": [],
    "aws_cognito_signup_attributes": [
        "PREFERRED_USERNAME",
        "EMAIL",
        "NAME"
    ],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": [
        "SMS"
    ],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": []
    },
    "aws_cognito_verification_mechanisms": [
        "EMAIL"
    ]
});




const Page=()=> {
  const scrollViewRef = useRef()
  const [user,setUser]=useState('undefined')
   const checkUser=async()=>{
   try{ 
  const authUser= await Auth.currentAuthenticatedUser({bypassCache:true})
  setUser(authUser)
    }
    catch(e){
      setUser(null)

    }
  
   }
   useEffect(()=> {checkUser() },[])

   useEffect(()=> {
    const listener =(data)=>{
      if(data.payload.event=='signIn' || data.payload.event=='signOut' ){
        checkUser()

      }
    


   }


    Hub.listen('auth',listener)
   return()=>Hub.listen('auth',listener)
  
  
  
  
  },[])
  const [isLoaded, setIsLoaded] = React.useState(false);
  React.useEffect(() => {
    setTimeout(() => setIsLoaded(true),  1000) // Simulate a 3 second delay
  }, []);


  
  return  user? (
    <ImageBackground source={img} style={styles.background}>

    <View style={styles.container}>
    
     {user? <Chat/> : <Sign/>}
     
    
    </View>
    </ImageBackground>
   ) : isLoaded?(
    <ImageBackground source={img} style={styles.background}>

    <View style={styles.container}>
    
     {user? <Chat/> : <Sign/>}
     
    
    </View>
    </ImageBackground>

   ):(

    <LoadingScreen/>
    
    
  );
}

const styles = StyleSheet.create({
  background:{ flex: 1,
    resizeMode: 'stretch',
    
  
  height:'140%',
  width:'100%'
  
},
    
  container: {
    flex: 1,
   
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});


export default  Page
