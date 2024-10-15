import Colors from '@constants/Colors';
import React, { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

//extend the props from the Modal component
export type CustomAlertProps = {
  visible: boolean;
  children: ReactNode;
};

export function CustomAlert({
  visible,
  children,
}: CustomAlertProps & React.ComponentProps<typeof Modal>) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <Toast />
      <View style={styles.centeredView}>
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.modalView}>{children}</View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: Colors.BLACK,
    borderWidth: 2,
    borderColor: Colors.WHITE,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
});
