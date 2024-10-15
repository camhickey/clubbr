import { Button } from '@components/Button';
import { CustomAlert } from '@components/CustomAlert';
import { Text } from '@components/Text';
import { View } from '@components/View';
import Colors from '@constants/Colors';
import { db } from '@db*';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

export type ShowSafetyReportModalProps = {
  id: string;
  isVisible: boolean;
  onClose: () => void;
};

export function ShowSafetyReportModal({ id, isVisible, onClose }: ShowSafetyReportModalProps) {
  const [safetyReport, setSafetyReport] = useState({
    description: 'Loading...',
    timestamp: 0,
  });

  useEffect(() => {
    id &&
      getDoc(doc(db, 'safety', id)).then((safetyReportDoc) => {
        if (safetyReportDoc.exists()) {
          const data = safetyReportDoc.data()!;
          setSafetyReport({
            description: data.description,
            timestamp: data.timestamp,
          });
        }
      });
  }, []);

  return (
    <CustomAlert visible={isVisible}>
      <View style={styles.container}>
        <Text style={styles.header}>Safety Report</Text>
        <Text style={styles.blurb}>{safetyReport.description}</Text>
        <Text style={styles.blurb}>
          Reported:{' '}
          {
            // Firebase timestamp is being weird and not converting to date properly
            // @ts-ignore
            new Date(safetyReport.timestamp.seconds * 1000).toLocaleString('en-US', {
              timeZone: 'UTC',
              hour12: true,
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })
          }
        </Text>
        <Button onPress={onClose}>CLOSE</Button>
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
});
