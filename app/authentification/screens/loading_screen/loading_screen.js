import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { ImageBackground } from "react-native";

// Import the image file
import img from 'biat_bot/app/assets/bgmosaique2.png'

// Define the LoadingScreen component
const LoadingScreen = () => {
  return (
    // Render an ImageBackground component with the imported image as the background
    <ImageBackground source={img} style={styles.background}> 

      {/* Render a View container for the loading screen content */}
      <View style={styles.container}>
        
        {/* Render a BIAT logo image */}
        <Image
          style={styles.image}
          source={require('biat_bot/app/assets/biatlogo.jpg')}
        />
     
      </View>
    </ImageBackground>
  );
};

// Export the LoadingScreen component as the default export
export default LoadingScreen;

// Define the styles for the component using StyleSheet.create()
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginTop:500
  },
  background: {
    flex: 1,
    resizeMode: 'stretch',
    height: '100%',
    width: '100%'
  }
});
