import { Container } from '@components/Container';
import Colors from '@constants/Colors';
import { useProfile } from '@hooks/useProfile';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';

import { PartyInvites } from './Tabs/PartyInvites';
import { PendingFriendRequests } from './Tabs/PendingFriendRequests';
import { ReceivedFriendRequests } from './Tabs/ReceivedFriendRequests';

function notifcationBadge(count: number) {
  if (count === 0) return '';
  return count > 99 ? '99+' : count;
}

export function InboxScreen() {
  const Tab = createMaterialTopTabNavigator();

  const { invites, friendRequestsReceived, friendRequestsPending } = useProfile();

  return (
    <Container>
      <Tab.Navigator
        initialRouteName="Invites"
        screenOptions={{
          tabBarActiveTintColor: Colors.WHITE,
          tabBarInactiveTintColor: Colors.INACTIVE,
          tabBarIndicatorStyle: { backgroundColor: Colors.WHITE },
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: Colors.BLACK },
        }}>
        <Tab.Screen
          name="Invites"
          component={PartyInvites}
          options={{ tabBarLabel: `\nParty Invites\n${notifcationBadge(invites.length)}` }}
        />
        <Tab.Screen
          name="Received"
          component={ReceivedFriendRequests}
          options={{
            tabBarLabel: `\nReceived\n${notifcationBadge(friendRequestsReceived.length)}`,
          }}
        />
        <Tab.Screen
          name="Pending"
          component={PendingFriendRequests}
          options={{ tabBarLabel: `\nPending\n${notifcationBadge(friendRequestsPending.length)}` }}
        />
      </Tab.Navigator>
    </Container>
  );
}
