// Importing required modules
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, StyleSheet } from 'react-native';
import Custombutton from '../../components/custom_button/Custombutton';
import Custom_input from '../../components/Custom_input';
import { Button } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { useRoute } from '@react-navigation/native';
import { Auth } from 'aws-amplify';
import { Alert } from 'react-native';
import Sign from '../sign_screen/sign';
import { ImageBackground } from 'react-native';
import img from 'biat_bot/app/assets/bgmosaique2.png';

const newpass = () => {
  // Setting up necessary states
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setPasswordRepeat] = useState('');

  // Getting router and route objects
  const router = useRouter();
  const route = useRoute();

  // Setting up the form and required rules
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ defaultValues: { username: route?.param?.username } });

  const username = watch('username');

  // Function for navigating back to sign in screen
  const onBackSignIn = () => {
    router.back();
  };

  // Function for submitting new password request
  const onRegister = async (data) => {
    try {
      await Auth.forgotPasswordSubmit(username.toLowerCase(), data.code, data.password);

      Alert.alert('success', 'your password was changed');
      router.back();
      router.back();
    } catch (e) {
      Alert.alert('oops', 'wrong code');
    }
  };

  // Function for requesting new password
  const onForgotPassword = () => {
    console.warn('forgot password');
  };

  // Returning the JSX elements
  return (
    <ImageBackground source={img} style={styles.background}>
      <View style={styles.root}>
        <Text style={styles.title}> Reset your password </Text>

        {/* Custom input for username */}
        <Custom_input
          name_="username"
          control={control}
          placeholder="Username"
          rules={{ required: 'username is required' }}
          username={username}
        />

        {/* Custom input for confirmation code */}
        <Custom_input
          name_="code"
          control={control}
          placeholder="Enter your confirmation code"
          rules={{ required: 'confirmation code is required' }}
          username={code}
        />

        {/* Custom input for new password */}
        <Custom_input
          name_="password"
          control={control}
          placeholder="Password"
          rules={{
            required: 'password is required',
            minLength: {
              value: 6,
              message: 'password should be minimum 6 caracters long',
            },
          }}
          username={password}
          secureTextEntry={true}
        />

        {/* Submit button */}
        <Custombutton onPress={handleSubmit(onRegister)} text="submit" />

        {/* Back to Sign in button */}
        <Custombutton
          onPress={onBackSignIn}
          text="Back to Sign in"
          type="TERITIARY"
        />

        <StatusBar style="auto" />
      </View>
    </ImageBackground>
  );
};
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

  
  export default newpass