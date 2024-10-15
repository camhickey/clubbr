import { submitSafetyReport } from '@actions/safetyActions';
import { Button } from '@components/Button';
import { CustomAlert } from '@components/CustomAlert';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { useProfile } from '@hooks/useProfile';
import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import Toast from 'react-native-toast-message';

export type MakeSafetyReportModalProps = {
  location: { latitude: number; longitude: number };
  isVisible: boolean;
  onClose: () => void;
};

type SafetyReport = {
  description: string;
  location: { latitude: number; longitude: number };
  timestamp: number;
};

export function MakeSafetyReportModal({
  location,
  isVisible,
  onClose,
}: MakeSafetyReportModalProps) {
  const { username } = useProfile();
  const SAFETY_REPORT_MAX_LENGTH = 200;
  const [safetyReport, setSafetyReport] = useState<SafetyReport>({
    description: '',
    location,
    timestamp: Date.now(),
  });

  return (
    <CustomAlert visible={isVisible}>
      <View style={styles.container}>
        <Text style={styles.header}>Make a Safety Report</Text>
        <Text style={styles.blurb}>Please describe the safety concern you are reporting.</Text>
        <TextInput
          style={styles.input}
          placeholder="Type your description here..."
          placeholderTextColor={Colors.SUBTEXT}
          multiline
          blurOnSubmit
          textAlignVertical="top"
          maxLength={SAFETY_REPORT_MAX_LENGTH}
          value={safetyReport.description}
          onChangeText={(text) => setSafetyReport({ ...safetyReport, description: text })}
        />
        <Text style={styles.descriptionLength}>
          Characters: {safetyReport.description.length}/{SAFETY_REPORT_MAX_LENGTH}
        </Text>
        <View style={styles.controls}>
          <Button onPress={onClose}>CANCEL</Button>
          <Button
            disabled={safetyReport.description.length === 0}
            onPress={() => {
              submitSafetyReport(
                username,
                safetyReport.description,
                safetyReport.location.latitude,
                safetyReport.location.longitude,
              )
                .then(() => {
                  Toast.show({
                    type: 'success',
                    text1: 'Safety report submitted',
                    text2: 'Your safety report has been submitted successfully!',
                  });
                })
                .catch((error) => {
                  Toast.show({
                    type: 'error',
                    text1: 'Failed to submit safety report',
                    text2: error.message,
                  });
                });
            }}>
            SUBMIT
          </Button>
        </View>
      </View>
    </CustomAlert>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  blurb: {
    color: Colors.SUBTEXT,
  },
  input: {
    backgroundColor: Colors.INPUT,
    borderRadius: 10,
    padding: 10,
    color: Colors.WHITE,
  },
  descriptionLength: {
    color: Colors.SUBTEXT,
    alignSelf: 'flex-end',
    fontSize: 12,
  },
  controls: {
    padding: 10,
    gap: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
