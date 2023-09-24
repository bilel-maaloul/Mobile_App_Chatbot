import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';

// Define a reusable custom button component that takes several props:
// - "onPress": a function that gets called when the button is pressed
// - "text": the text that gets displayed on the button
// - "type": the type of button to render (e.g. PRIMARY, SECONDARY, etc.)
// - "bgColor": the background color of the button (optional)
// - "fgColor": the foreground color of the button text (optional)
const Custombutton = ({onPress,text,type='PRIMARY',bgColor,fgColor}) => {
  return (
    // Use the "Pressable" component to create a button that responds to touch events
    <Pressable
      onPress={onPress}
      // Apply styles to the button based on its "type" prop and any additional
      // "bgColor" prop that was passed in.
      style={[
        styles.container,
        styles[`container_${type}`],
        bgColor ? { backgroundColor: bgColor } : {},
      ]}
    >
      {/* Render the button text using the "Text" component */}
      <Text
        style={[
          styles.text,
          styles[`text_${type}`],
          fgColor ? { color: fgColor } : {},
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
};

// Define a stylesheet for the "Custombutton" component
const styles = StyleSheet.create({
  container: {
    width: '80%',
    alignItems: 'center',
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
  },
  container_PRIMARY: {
    backgroundColor: '#3B71F3',
  },
  container_SECONDARY: {
    borderColor: '#3B71F3',
    borderWidth: 2,
  },
  container_TERITIARY: {},
  container_reset: {
    margin: 10,
    borderColor: '#f59d00',
    borderWidth: 2,
    borderRadius: 5,
  },
  container_delete: {
    margin: 10,
    borderColor: '#f59d00',
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: '#f59d00',
  },
  text: {
    fontWeight: 'bold',
    color: 'white',
  },
  text_PRIMARY: {},
  text_SECONDARY: {
    color: '#3B71F3',
  },
  text_TERITIARY: {
    color: 'gray',
  },
  text_reset: {
    color: '#f59d00',
  },
  text_delete: {
    color: 'white',
  },
});

// Export the "Custombutton" component as the default export of this module
export default Custombutton;
