import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Modal,
  View,
  StyleSheet,
} from 'react-native';
import { ScoreInput } from '../components';

export default function ScoreInputModal(props) {
  const Container = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

  return (
    <Modal
      animationType="fade"
      onRequestClose={props.onCancel}
      transparent={true}
      visible={!!props.data}
    >
      <Container behavior="height" style={styles.container}>
        <ScoreInput
          modus={props.modus}
          getSet={props.getSet}
          onCancel={props.onCancel}
          onSave={props.onSave}
          data={props.data}
        />
      </Container>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,.5)',
  },
});
