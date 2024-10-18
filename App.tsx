import { toastConfig } from '@components/ToastConfig';
import useCachedResources from '@hooks/useCachedResources';
import { PartyProvider } from '@hooks/useParty';
import { ProfileProvider } from '@hooks/useProfile';
import { StatusBar } from 'expo-status-bar';
import { getAuth } from 'firebase/auth';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { Navigation } from './navigation';

export default function App() {
  const auth = getAuth();
  const isLoadingComplete = useCachedResources();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  });

  if (!isLoadingComplete) {
    return null;
  } else if (!isLoggedIn) {
    return (
      <SafeAreaProvider>
        <Navigation />
        <StatusBar />
      </SafeAreaProvider>
    );
  } else {
    return (
      <>
        <SafeAreaProvider>
          <ProfileProvider>
            <PartyProvider>
              <Navigation />
              <StatusBar />
            </PartyProvider>
          </ProfileProvider>
        </SafeAreaProvider>
        <Toast config={toastConfig} />
      </>
    );
  }
}
