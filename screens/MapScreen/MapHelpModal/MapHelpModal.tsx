import { ModalContainer } from '@components/ModalContainer';
import { Text } from '@components/Text';
import Colors from '@constants/Colors';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';

export function MapHelpModal() {
  return (
    <ModalContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.header}>
            Map <FontAwesome name="map" size={24} color={Colors.WHITE} />
          </Text>
          <Text style={styles.body}>
            Your map is the main way to view information about clubs, safety, and your party. Your
            menu in the bottom-right of the map controls what appears on your map. Markers that are
            close to each other on your map will appear as clusters with a number on top of them.
            Zooming into the map, or tapping the cluster, will let you see each individual marker.
            Interact with markers to get more information on them.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>
            Menu <AntDesign name="plus" size={24} color={Colors.WHITE} />
          </Text>
          <Text style={styles.body}>
            The <AntDesign name="plus" size={16} color={Colors.WHITE} /> button at the bottom-right
            of your map can be pressed to bring up a menu that controls what you see. The options
            are listed below.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>
            Clubs <FontAwesome name="map-marker" size={24} color={Colors.WHITE} />
          </Text>
          <Text style={styles.body}>
            Toggling this option determines the visibility of clubs on your map. Clubs appear as{' '}
            <FontAwesome name="map-marker" size={16} color={Colors.WHITE} /> on your map. Tapping on
            them brings you to the club's page, where you can read more about the club, see real
            time updates, and view the comments other users have left about the club.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>
            Safety <FontAwesome name="exclamation-triangle" size={24} color={Colors.WHITE} />
          </Text>
          <Text>
            Toggling this option determines the visibility of safety markers on your map. Users can
            post safety notices to the map, where they appear as{' '}
            <FontAwesome name="exclamation-triangle" size={16} color={Colors.ORANGE} /> markers.
            Similar to clubs, you can tap on these to see more information about them. If you see
            something concerning that other users may want to know about, you can long press on the
            location of the incident on your map to fill out a report. The icon will appear on the
            location you pressed and expire after 12 hours. Reports are anonymous.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>
            Party <FontAwesome name="group" size={24} color={Colors.WHITE} />
          </Text>
          <Text>
            Toggling this option determines the visibility of your party members on your map. When
            you are in a party, you can see the location of each party member on your map. Their
            locations update every 60 seconds.
          </Text>
        </View>
      </ScrollView>
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 10,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    alignItems: 'center',
  },
  body: {
    alignItems: 'center',
  },
});
