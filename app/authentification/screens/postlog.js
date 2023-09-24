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
import { useSearchParams } from 'expo-router';




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
      backgroundColor: '#40AD4D',
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
      backgroundColor: '#40AD4D',
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
        backgroundColor: '#40AD4D',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      
       
       
      },
      logoutButtonText: {
        
        fontSize: 16,
        fontWeight: 'bold',
      },
  });
  const params = {
    TableName: 'discussion_table',
    KeyConditionExpression: 'user_name = :bilel_123',
    ExpressionAttributeValues: {
      ':bilel_123': 'bilel123',
      
      
    }
   
  };
   
 
  export default  class Chat extends Component {
    
     
      constructor(props) {
      super(props);
      this.flatListRef = React.createRef(); // create a ref for FlatList
     
      this.example()
      this.state = {
        userInput: '',
        messages: [],
        inputEnabled: true,
        name:null
      };
      
      
    }
   

     async  example() {

    const value = await dynamoDB.query(params).promise();
      let value_=value['Items']['0']['message']// 👉️ "Hello World"
     
      this.setState({
        messages: value_,
        
      }); 
      
    }
    componentDidMount() {
      // call your function here
      this.example()
       
    }

    
  
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
      const params = {
        TableName: 'discussion_table',
        Item: {
          user_name: 'bilel123',
          message:oldMessages ,
          timestamp: new Date().toISOString()
        }}
      await dynamoDB.put(params).promise();
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
          // TODO SHOW ERROR ON MESSAGES
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
      const params = {
        TableName: 'discussion_table',
        Item: {
          user_name: 'bilel123',
          message:oldMessages ,
          timestamp: new Date().toISOString()
        }}
      await dynamoDB.put(params).promise();
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
      let style,
        responseStyle;
      if (item.from === 'bot') {
        style = styles.botMessages;
        responseStyle = styles.responseContainer;
      } else {
        style = styles.userMessages;
        responseStyle = {};
      }
      return (
        <View style={responseStyle}>
          <Text style={style}>{item.msg}</Text>
        </View>
      );
    }
  
    render() {
     
      return (
        <View style={styles.container}>
          <View style={styles.messages}>
            <FlatList
              data={this.state.messages}
              renderItem={({ item }) => this.renderTextItem(item)}
              keyExtractor={(item, index) => index}
              extraData={this.state.messages}
              ref={this.flatListRef} // set the FlatList ref to the created ref
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
                <TouchableOpacity onPress={async()=> {await Auth.signOut() 
                                           console.log(this.oldMessages)                           }} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
                </View>
           
           )
    }
} 