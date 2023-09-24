import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, StyleSheet } from 'react-native';
import Custombutton from '../../components/custom_button/Custombutton';
import Custom_input from '../../components/Custom_input';
import Sign from '../sign_screen/sign';
import { Button } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { Auth } from 'aws-amplify';
import { Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AWS from 'aws-sdk/dist/aws-sdk-react-native'
import { ImageBackground } from 'react-native';
import img from 'biat_bot/app/assets/bgmosaique2.png'

// Define the ConfirmSign component
const ConfirmSign = () => {
  // Get the current route using useRoute()
  const route = useRoute()
  // Set up state for the confirmation code, email, password, and username
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setPasswordRepeat] = useState('')
  const [Username, setUsername] = useState('')
  // Get the router using useRouter()
  const router = useRouter()
  // Set up the form using useForm()
  const { control, handleSubmit, formState: { errors }, watch } = useForm({ defaultValues: { username: route?.param?.username } })
  // Set up a regular expression for email validation
  const Email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  // Set up AWS SDK configuration
  const cognito = new AWS.CognitoIdentityServiceProvider();
  AWS.config.region = 'us-east-1'; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:3502561b-0967-47fa-9464-73e7b45055a5',
  });
  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  // Define a function to navigate back to the sign in screen
  
  // Watch the username input field
  const username = watch('username')

  // Define a function to handle the form submission when the user confirms their email
  const onRegister = async (data) => {
    try {
      // Use Amplify to confirm the user's email
      const response = await Auth.confirmSignUp(username.toLowerCase(), data.code)
      console.log(response)
      // Set up a DynamoDB table for the user
      const params = {
        TableName: 'discussion_table',
        Item: {
          user_name: username.toLowerCase(),
          message: [],
          timestamp: new Date().toISOString()
        }
      }
      // Put the user's data in the DynamoDB table
      await dynamoDB.put(params).promise();
      // Show a success message to the user
      Alert.alert('success', 'account created successefully')
      // Navigate back to the sign in screen
      router.back()
      router.back()
    } catch (e) {
      // Show an error message to the user
      Alert.alert('oops', e.message)
      console.log(e.message)
    }
  }
 
  const onResend=async()=>{
    try{
      await Auth.resendSignUp(username.toLowerCase())
      Alert.alert('success','code was resent to your mail')
    }
    catch(e){
      Alert.alert('oops',e.message)
    }
  }

  // Define functions for signing in with Google, Facebook, and Apple
  const onSignGoogle=()=>{
    console.warn('Google')
  }
  const onSignFacebook=()=>{
    console.warn('Facebook')
  }
  const onSignApple=()=>{
    console.warn('Apple')
  }

  // Define functions for navigating to the terms and privacy policy screens
  const onTerms=()=>{
    console.warn('terms')
  }
  const onPrivacy=()=>{
    console.warn('privacy')
  }

  // Define a function to navigate back to the sign-in screen
  const onBackSignIn=()=>{
    navigation.navigate('Signin')
  }

  // Render the component
  return (
    <ImageBackground source={img} style={styles.background}> 
      <View style={styles.root}>
        <Text style={styles.title}> Confirm your email </Text>

        {/* Render a custom input component for the username */}
        <Custom_input 
          name_='username'
          control={control}
          placeholder='Username'
          rules={{required :'username is required'}} 
          username={username} 
        />

        {/* Render a custom input component for the confirmation code */}
        <Custom_input 
          name_='code'
          control={control}
          placeholder='Enter your confirmation code'
          rules={{required :'confirmation code is required'}} 
          username={code} 
        />

        {/* Render a custom button component for submitting the form */}
        <Custombutton
          onPress={handleSubmit(onRegister)}
          text='Confirm'
        />

        {/* Render a custom button component for resending the confirmation code */}
        <Custombutton
          onPress={onResend}
          text='Resend code'
          type='SECONDARY'
        />

        {/* Render custom buttons for signing in with Google, Facebook, and Apple */}
        <Custombutton
          onPress={onSignGoogle}
          text='Sign in with Google'
          type='GOOGLE'
        />
        <Custombutton
          onPress={onSignFacebook}
          text='Sign in with Facebook'
          type='FACEBOOK'
        />
        <Custombutton
          onPress={onSignApple}
          text='Sign in with Apple'
          type='APPLE'
        />

        {/* Render custom buttons for navigating to the terms and privacy policy screens */}
        <Text style={styles.text}> By signing up, you agree to our </Text>
        <View style={{flexDirection:'row'}}>
          <Text style={styles.link} onPress={onTerms}> Terms of Service </Text>
          <Text style={styles.text}> and </Text>
          <Text style={styles.link} onPress={onPrivacy}> Privacy Policy</Text>
        </View>
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

  
  export default ConfirmSign