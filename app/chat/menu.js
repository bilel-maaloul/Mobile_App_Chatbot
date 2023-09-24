import React, { useState } from 'react';
import { StyleSheet, Modal, TouchableWithoutFeedback, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function menu() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Icon name="user" size={20} color="black" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.overlay}>
            <View style={styles.menu}>
              <TouchableOpacity onPress={() => console.log('Profile pressed')}>
                <Text style={styles.menuItem}>Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => console.log('Settings pressed')}>
                <Text style={styles.menuItem}>Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.menuItem}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menu: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
  },
  menuItem: {
    fontSize: 20,
    padding: 10,
  },
});