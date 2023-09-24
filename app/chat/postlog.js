import React, { Component } from 'react'
import {
    Text, 
    View, 
    StyleSheet,
    TextInput,
    FlatList,
} from 'react-native'
import AWS from 'aws-sdk/dist/aws-sdk-react-native'
import { TouchableOpacity } from 'react-native';
import { Auth } from 'aws-amplify';
import { Link, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import Menu from './menu';
import { Modal } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AwsLexCard from './respondCard';
import { Image } from 'react-native';
import img from 'biat_bot/app/assets/currency.jpg'
import { Linking } from 'react-native';
import card from 'biat_bot/app/assets/cards.jpg'
import Question from 'biat_bot/app/assets/question.jpg'


// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:3502561b-0967-47fa-9464-73e7b45055a5',
});


const dynamoDB = new AWS.DynamoDB.DocumentClient();
let lexRunTime = new AWS.LexRuntime()
let lexUserId = 'mediumBot' + Date.now()

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    messages: {
      flex: 1,
      marginTop: 20,
    },
    botMessages: {
      backgroundColor: '#F2F2F2',
      padding: 10,
      borderRadius: 20,
      marginBottom: 10,
      marginTop:30,
      
      alignSelf: 'flex-start',
      maxWidth: '75%',
    },
    userMessages: {
      backgroundColor: '#3B71F3',
      color: 'white',
      padding: 10,
      marginBottom: 10,
      marginLeft: 'auto',
      marginRight:10,
      borderRadius: 20,
      maxWidth: '65%',
      alignSelf: 'flex-end',
      marginTop:50,
    },
    textInput: {
      flex: 2,
      paddingLeft: 15,
      fontSize: 16,
    },
    responseContainer: {
      flexDirection: 'row',
      marginTop: 20,
      marginBottom: 0,
      paddingHorizontal: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      backgroundColor: '#F8F8F8',
      borderTopWidth: 1,
      borderTopColor: '#EAEAEA',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    sendButton: {
      marginLeft: 10,
      backgroundColor: '#f59d00',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
    },
    sendButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    logoutButton: {
        position: 'absolute',
        top: 20,
        left: 10,
        backgroundColor: '#f59d00',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      
       
       
      },
      logoutButtonText: {
        
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white'
      },
      button: {
        
      top:8,
 
     
      
    marginLeft:100,
      paddingLeft: 2000,
      paddingVertical: 25 ,
      borderRadius: 0,
      backgroundColor: '#f59d00',
      },
      
  });
  
  export default  class App extends Component {
    
     
      constructor(props) {
      super(props);
      this.flatListRef = React.createRef(); // create a ref for FlatList
      this.example()
      this.state = {
        userInput: '',
        messages: [],
        inputEnabled: true,
        user_name:'',
        menuOpen: false,
         options: ['EUR', 'USD', 'JPY','CHF','GBP'],
         card_options:[['Carte Technologique','https://www.biat.tn/biat/Fr/carte-technologique_63_356'],
         ['Carte VISA ou MasterCard classique','https://www.biat.tn/biat/Fr/carte-visa-ou-mastercard-classique_63_31'],
         ['Carte CHABEB','https://www.biat.tn/biat/Fr/carte-chabeb_63_343'],
         ['Carte FLY','https://www.biat.tn/biat/Fr/carte-fly_63_358'],
         ['Carte CASH','https://www.biat.tn/biat/Fr/carte-cash_63_359'],
         ],
         help_options:['What are the requirements for opening a business account',
        'What are the options for withdrawing cash from my account',
        'Can I apply for a mortgage online',
        'branch in my zone',
        'I want to change currency',
        'show me card',
        'What are the current interest rates for savings accounts',
        'Can I transfer money to another account',
        'how do i open a new account',
        'How can I apply for a loan',
        'Can I view my transaction history online',
        'Can I dispute a transaction on my account',
        'What are the current interest rates',
        'what is the current exchange rate for foreign currency'
      ]
      };
      
      
    }

     async  example() {
      const { username } = await Auth.currentAuthenticatedUser();
      const params = {
        TableName: 'discussion_table',
        KeyConditionExpression: 'user_name = :user_name',
        ExpressionAttributeValues: {
          ':user_name': username,

        }
        
      
      };
     
      

      toggleMenu = () => {
        this.setState((prevState) => ({ menuOpen: !prevState.menuOpen }));
      };
      
     try{
      const { username } = await Auth.currentAuthenticatedUser();
    const value = await dynamoDB.query(params).promise();
      let value_=value['Items']['0']['message']
   
      const values = Object.values(value_);
      if(values.some(msg => msg.msg === 'welcome to biat bot '+username+' if  you need to know the commandes  send "help" ')){
        console.log('found you')
       

      }
      else{
      value_.push({ from: 'bot', msg: 'welcome to biat bot '+username+' if  you need to know the commandes  send "help" '})
      console.log(value_)
      }


     
      this.setState({
        messages: value_,
        
      },
     
      
      () => {
            
           
        }); 
        
      }
      catch(e){
        console.log("don't care")
      }

      
    }
    async componentDidMount() {
      // call your function here
      this.example()
    }
    setModalVisible = (visible) => {
      this.setState({ modalVisible: visible });
    };
  
  
    
  
    // Sends Text to the lex runtime
    handleTextSubmit() {
      let inputText = this.state.userInput.trim();
      if (inputText !== '') this.showRequest(inputText);
    }
  
    // Populates screen with user inputted message
    async showRequest(inputText) {
      // Add text input to messages in state
     
      let oldMessages = Object.assign([], this.state.messages);
      oldMessages.push({ from: 'user', msg: inputText });
      const { username } = await Auth.currentAuthenticatedUser();
      const params = {
        TableName: 'discussion_table',
        Item: {
          user_name:  username,
          message:oldMessages ,
          timestamp: new Date().toISOString()
        }}
        try{
      await dynamoDB.put(params).promise();
        }
        catch(e){
          console.log("don't care")

        }
      this.setState({
        messages: oldMessages,
        userInput: '',
        inputEnabled: false,
      });
      this.sendToLex(inputText);
    }
  
    // Responsible for sending message to lex
    sendToLex(message) {
      let params = {
        botAlias: '$LATEST',
        botName: 'biat_bot',
        inputText: message,
        userId: lexUserId,
      };
      lexRunTime.postText(params, (err, data) => {
        if (err) {
          this.sendToLex('error')
        }
        if (data) {
          this.showResponse(data);
        }
      });
    }
  
    async showResponse(lexResponse) {
      let offset=0
      let lexMessage = lexResponse.message;
      let oldMessages = Object.assign([], this.state.messages);
      oldMessages.push({ from: 'bot', msg: lexMessage });
      const { username } = await Auth.currentAuthenticatedUser();
      const params = {
        TableName: 'discussion_table',
        Item: {
          user_name: username,
          message:oldMessages ,
          timestamp: new Date().toISOString()
        }}
        try{
      await dynamoDB.put(params).promise();
        }
        catch(e){
          console.log("'don't care")
        }
      this.setState(
        {
          messages: oldMessages,
          inputEnabled: true,
        },
        
        () => {
          // scroll to end of list after updating state
           let y = offset + 10000000;
          this.flatListRef.current.scrollToOffset({offset:y, animated: true });
           offset=y
          
        }
      );
    }
  
    renderTextItem(item) {
      try{
      let style,
        responseStyle;
      if (item.from === 'bot') {
        style = styles.botMessages;
        responseStyle = styles.responseContainer;
      } else {
        style = styles.userMessages;
        responseStyle = {};
      }
      if (item.msg.toLowerCase().includes('exchange') & item.msg.toLowerCase().includes('currency')){
        return ( 
          <View style={responseStyle}>
             <Text style={style}>{item.msg}</Text>
             <View style={{ backgroundColor: '#f5f5f5', padding: 10,width:300,marginTop:50, }}>
              <Image  source={img} style={{ height:200,width:280 }}/>  
        <Text style={{ marginBottom: 10 }}>Currency options:</Text>
        {this.state.options.map((option, index) => (
          <TouchableOpacity key={index} style={{ backgroundColor: '#3B71F3', borderRadius: 5, padding: 10, marginBottom: 10,textAlign:'center' }}
          onPress={()=>this.sendToLex(option)}>
            <Text style={{ color: '#fff' }}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

            

        </View>)

      }
       if (item.msg=='show me card' || (item.msg.toLowerCase().includes('show') & item.msg.toLowerCase().includes('card')) ){
        return(
        <View style={responseStyle}>
             <Text style={style}>{item.msg}</Text>
             <View style={{ backgroundColor: '#f5f5f5', padding: 10,width:300,marginTop:50, }}>
              <Image  source={card} style={{ height:200,width:280 }}/>  
        <Text style={{ marginBottom: 10 }}>cards types:</Text>
        {this.state.card_options.map((option, index) => (
          <TouchableOpacity key={index} style={{ backgroundColor: '#3B71F3', borderRadius: 5, padding: 10, marginBottom: 10,textAlign:'center' }}
          onPress={()=>{Linking.openURL(option[1])
            this.showRequest(option[0])}}>
            <Text style={{ color: '#fff' }}>{option[0]}</Text>
          </TouchableOpacity>
        ))}
        
      </View>

            

        </View>
        )

       }
       if (item.msg.toLowerCase()=='help' || item.msg.toLowerCase()=='help me'  ){
        return(
        <View style={responseStyle}>
             <Text style={style}>{item.msg}</Text>
             <View style={{ backgroundColor: '#f5f5f5', padding: 10,width:300,marginTop:50, }}>
              <Image  source={Question} style={{ height:200,width:280 }}/>  
        <Text style={{ marginBottom: 10 }}>Questions:</Text>
        {this.state.help_options.map((option, index) => (
          <TouchableOpacity key={index} style={{ backgroundColor: '#3B71F3', borderRadius: 5, padding: 10, marginBottom: 10,textAlign:'center' }}
          onPress={()=>this.showRequest(option)}>
            <Text style={{ color: '#fff' }}>{option}</Text>
          </TouchableOpacity>
        ))}
        
      </View>

            

        </View>
        )

       }


      else {

      return (
        <View style={responseStyle}>
          <Text style={style}>{item.msg}</Text>
          
        </View>
      
      );
      }
    }
    catch(e){
      console.log('stop')
    }
    }
  
    render() {
      const { menuOpen } = this.state;
      return (

        <View style={styles.container}>


      
           <Link href={'./chat/user_menu'}>
                <TouchableOpacity style={styles.button} activeOpacity={0.01}  >
               <Text>user</Text>
                </TouchableOpacity>
                </Link>
         
          <View style={styles.messages}>
          <View>
     
    </View>
            
            <FlatList
              data={this.state.messages}
              renderItem={({ item }) => this.renderTextItem(item)}
              keyExtractor={(item, index) => index}
              extraData={this.state.messages}
              ref={this.flatListRef} // set the FlatList ref to the created ref
               
               onContentSizeChange={() =>{ try{this.flatListRef.current.scrollToOffset({offset:10000000, animated: false })} catch(e){console.log('nope')}}}
            />
      
          
            
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={(text) => this.setState({ userInput: text })}
              value={this.state.userInput}
              style={styles.textInput}
              editable={this.state.inputEnabled}
              placeholder={'Type here to talk!'}
              autoFocus={true}
              onSubmitEditing={this.handleTextSubmit.bind(this)}
            />
              <TouchableOpacity style={styles.sendButton} onPress={this.handleTextSubmit.bind(this)}>
                <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
                </View>
                
                <TouchableOpacity  style={styles.logoutButton}  onPress={async()=> { }}>
                <Link href={'./chat/user_menu'}>
                <Text style={styles.logoutButtonText}>Menu</Text>
                </Link>
                </TouchableOpacity>
                
                
              
               
                </View>
                
                
                
                
           
           )
    }
} 