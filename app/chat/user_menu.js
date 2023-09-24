import React from 'react';
import { StyleSheet, View, Text, Image, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Avatar from 'biat_bot/app/assets/avatar.jpg' 
import Custombutton from '../authentification/components/custom_button/Custombutton';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ImageBackground } from 'react-native';
import Img from 'biat_bot/app/assets/bgmosaique2.png'
import { useRouter } from 'expo-router';
import { Link } from 'expo-router';
import App from './postlog';
import Page from 'biat_bot/app/index.js';
import { Auth } from 'aws-amplify';
import newpass from './newpass';
import  { useState, useEffect } from 'react'
import AWS from 'aws-sdk/dist/aws-sdk-react-native'
import { Alert } from 'react-native';







const USER = {
  
  avatar: Avatar,
  

}


export default  function UserPage() {
  
  
  
  
  const get_user=async()=>{
    const email= await Auth.currentAuthenticatedUser()
    return email


  }
  
  const router=useRouter()
  const push=async()=>{
    try{
    router.back()
    }
    catch(e){
      console.log
    }
    
  }
  
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
  useEffect(() => {
      Auth.currentAuthenticatedUser()
      .then(user => {setUserData(user) 
        setLoading(false)})
      .catch(err => {console.log(err)
        setLoading(false);});
  },[]);

  const reset =async()=>{
  const dynamodb = new AWS.DynamoDB();
  const params = {
    TableName: 'discussion_table',
    Key: {
      'user_name': { S: userData.username }
    },
    UpdateExpression: 'SET #attrName = :attrValue',
    ExpressionAttributeNames: {
      '#attrName': 'message'
    },
    ExpressionAttributeValues: {
      ':attrValue': { "L": [] }
    },
    ReturnValues: 'UPDATED_NEW'
  };

 // Call the UpdateItem API with the defined parameters
await dynamodb.updateItem(params, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }})
  Alert.alert('success','your discussion has been reset')
}


const showConfirmationPrompt_reset = () => {
  Alert.alert(
    'Confirmation Prompt',
    'Are you sure you want to reset your discussion?',
    [
      {
        text: 'Cancel',
        
        style: 'cancel',
      },
      {
        text: 'Confirm',
        onPress: reset,
      },
    ],
    { cancelable: false },
  );
};
const delete_user=async()=>{
  const dynamodb = new AWS.DynamoDB();
  const params = {
    TableName: 'discussion_table',
    Key: {
      'user_name': { S: userData.username }
    }
  };
  try {
    await dynamodb.deleteItem(params).promise();
    console.log('Item deleted successfully!');
  } catch (error) {
    console.error('Error deleting item: ', error);
    Alert.alert('error','something gone wrong')
  }
  await Auth.deleteUser(userData.username);
  router.back()
  Alert.alert('success','your account has been successfully deleted !')
 
}
const showConfirmationPrompt_delete = () => {
  Alert.alert(
    'Confirmation Prompt',
    'Are you sure you want to delete your account ? This action cannot be reversed',
    [
      {
        text: 'Cancel',
        
        style: 'cancel',
      },
      {
        text: 'Confirm',
        onPress: delete_user,
      },
    ],
    { cancelable: false },
  );
};

  return (

    <ImageBackground source={Img} style={styles.background}>
      {loading ? (
      <Text>Loading...</Text>
    ) : (
    <View style={styles.container}>
     
      {  <TouchableOpacity  style={styles.back} onPress={()=> push()} >
      <Icon name="chevron-back-outline" size={24} color="#f59d00" />
    </TouchableOpacity>
  }
    
         <View style={styles.upper}> 
        
        <Image source={USER.avatar} style={styles.avatar} />
       
    </View>
      <View style={styles.header}>
        
      
   
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userData.username}</Text>
          <Text style={styles.userEmail}>{userData.attributes.email}</Text>
        </View>
        
      </View>
      <View style={styles.profile}>
        <Text style={styles.heading}>Profile Information</Text>
        <View style={styles.details}> 
        <Text style={styles.name}>Name :{userData.attributes.name}</Text>
        
        </View>
        
      </View>
      <View style={styles.posts}>
      <Custombutton
      onPress={async()=>{
        try{
        
        router.back()
        
       
        router.push('./chat/newpass')
        await Auth.forgotPassword(userData.username)
        }
        catch(e){
          Alert.alert('error','Network error')

        }
        }
       

      }
        text='Reset password'
        type='reset'
        />
       
       
        <Custombutton
        onPress={showConfirmationPrompt_delete}
        text='Delete account'
        type='delete'
        />
       
        
       
      </View>
    
    
    <View style={styles.posts_1}>
      <Custombutton
      onPress={async()=>{
        try{
        await Auth.signOut()
        router.back()
        }
        catch(e){
          Alert.alert('error','Network error')

        }
        



      }}
        
        text='Logout'
        type='reset'
        />

        <Custombutton
        onPress={showConfirmationPrompt_reset}
        text='Reset discussion'
        type='reset'
        />
       
        
       
      </View>
      </View>
    )}
   
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background:{ flex: 1,
    resizeMode: 'stretch',
    
  
  height:'140%',
  width:'100%'
  
},
  container: {
    marginTop:30,
    flex: 1,
  
    textAlign:'center',
    alignItems:'center'
  },
  upper:{
    flexDirection: 'row',

  },
  header: {
    
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom:20
  },
  back:{
   marginRight:300,
 
   
    
   
  
  paddingVertical: 10,
  borderRadius: 20,

  },
  details:{

    textAlign:'center',
    alignItems: 'center',
    marginBottom:20,
    marginTop:10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 25,
    marginRight: 10,
    marginTop:25
    
  },
  name:{
   
    fontSize: 16,
    color: 'gray',

  },

    
  
  pass:{
    left:90,
    fontSize: 16,
    color: 'gray',

  },
  userInfo: {
    flex: 1,
    marginRight: 10,
  },
  userName: {
    fontSize: 25,
    
    textAlign:'center',
  
    fontWeight:'bold',
    color:'#051C60',
   
    
  },
  posts_1: {
    alignItems:'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 90,
    marginLeft:50,
    marginTop:30
  },
  userEmail: {
    fontSize: 20,
    color: '#3B71F3',
    textAlign:'center',
  },
  profile: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign:'center',
    color:'#051C60'


  },
  info: {
    fontSize: 16,
    marginLeft:50,
    marginRight:40
  },
  posts: {
    alignItems:'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 90,
    marginLeft:50,
    marginTop:40
  },
  post: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postContent: {
    fontSize: 16,
    marginTop: 5,
  },
});