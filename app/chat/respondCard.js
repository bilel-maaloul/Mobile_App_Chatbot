import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Lex } from 'aws-amplify';
import AWS from 'aws-sdk/dist/aws-sdk-react-native'


const lexRuntime = new AWS.LexRuntime();
const lexUserId = 'userId' + Date.now();

class RespondCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 1,
      optionsPage1: ['Option 1', 'Option 2', 'Option 3'],
      optionsPage2: ['Option 4', 'Option 5', 'Option 6']
    };

    this.handleOptionSelect = this.handleOptionSelect.bind(this);
    this.showResponse = this.showResponse.bind(this);
    this.sendToLex = this.sendToLex.bind(this);
  }

  async sendToLex(message) {
    let params = {
      botAlias: '$LATEST',
      botName: 'YourBotName',
      inputText: message,
      userId: lexUserId,
      sessionAttributes: {
        currentPage: this.state.currentPage
      }
    };
    try {
      const data = await lexRuntime.postText(params).promise();
      this.showResponse(data);
    } catch (err) {
      console.log(err);
    }
  }

  handleOptionSelect(option) {
    // update current page and send selected option to Lex
    this.setState({ currentPage: this.state.currentPage + 1 }, () => {
      this.sendToLex(option);
    });
  }

  showResponse(data) {
    const message = {
      from: 'bot',
      msg: data.message,
      options: []
    };
    if (data.responseCard) {
      message.options = data.responseCard.genericAttachments[0].buttons.map(button => button.text);
    }
    this.props.onResponse(message);
  }

  renderPage1() {
    return (
      <View style={{ backgroundColor: '#f5f5f5', padding: 10 }}>
        <Text style={{ marginBottom: 10 }}>Select an option:</Text>
        {this.state.optionsPage1.map((option, index) => (
          <TouchableOpacity key={index} style={{ backgroundColor: '#00bfff', borderRadius: 5, padding: 10, marginBottom: 10 }}
          onPress={() => this.handleOptionSelect(option)}>
            <Text style={{ color: '#fff' }}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  renderPage2() {
    return (
      <View style={{ backgroundColor: '#f5f5f5', padding: 10 }}>
        <Text style={{ marginBottom: 10 }}>Select an option:</Text>
        {this.state.optionsPage2.map((option, index) => (
          <TouchableOpacity key={index} style={{ backgroundColor: '#00bfff', borderRadius: 5, padding: 10, marginBottom: 10 }}
          onPress={() => this.handleOptionSelect(option)}>
            <Text style={{ color: '#fff' }}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  render() {
    return (
      <>
        {this.state.currentPage === 1 && this.renderPage1()}
        {this.state.currentPage === 2 && this.renderPage2()}
      </>
    );
  }
}

export default RespondCard;