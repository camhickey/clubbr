import { ModalContainer } from '@components/ModalContainer';
import { Text } from '@components/Text';
import React, { useState } from 'react';

export function SafetyModal({ route }: any) {
  const { reportedLatitude, reportedLongitude, actualLatitude, actualLongitude } = route.params;
  const [incidentType, setIncidentType] = useState<string>('Select Incident Type');
  return (
    <ModalContainer>
      <Text>Lat: {reportedLatitude}</Text>
      <Text>Long: {reportedLongitude}</Text>
    </ModalContainer>
  );
}
