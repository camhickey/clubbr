import { View } from '@components/View';
import Colors from '@constants/Colors';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet } from 'react-native';
import { BaseToast, BaseToastProps, ErrorToast } from 'react-native-toast-message';

/*
  1. Create the config
*/
export const toastConfig = {
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: Colors.GREEN }}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
      text2NumberOfLines={2}
      renderTrailingIcon={() => (
        <View style={styles.iconContainer}>
          <Feather name="check-circle" size={24} color={Colors.GREEN} />
        </View>
      )}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props: BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: Colors.RED }}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
      text2NumberOfLines={2}
      renderTrailingIcon={() => (
        <View style={styles.iconContainer}>
          <MaterialIcons name="error-outline" size={24} color={Colors.RED} />
        </View>
      )}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  info: (props: BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: Colors.WHITE }}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
      text2NumberOfLines={2}
      renderTrailingIcon={() => (
        <View style={styles.iconContainer}>
          <Feather name="info" size={24} color={Colors.WHITE} />
        </View>
      )}
    />
  ),
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: Colors.BLACK,
  },
  text1: {
    color: Colors.WHITE,
    fontSize: 16,
  },
  text2: {
    color: Colors.SUBTEXT,
    fontSize: 13,
  },
  iconContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 10,
  },
});
