import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View, Platform, StatusBar } from 'react-native';
import FixturesView from './Features/Fixtures/Fixtures';
import * as GlobalConstants from './Global/GlobalConstants'
import { useGetFixturesQuery, useGetOverviewQuery } from './Store/fplSlice';
import { useAppSelector } from "./Store/hooks";
import { ScreenTypes } from "./Store/navigationSlice";
import ModalNavigator from "./Modals/ModalNavigator";
import { LineupViewQueriesContainer } from "./Features/LineupView";
import PlayerStats from "./Features/PlayerStats";
import FixturesContainer from "./Features/Fixtures/FixturesContainer";

const MainPage = () => {

  const overview = useGetOverviewQuery();
  const fixtures = useGetFixturesQuery();
  const navigation = useAppSelector(state => state.navigation);

  useEffect( function refetchFixtures() {
    if (fixtures.isError) {
      setTimeout(() => { fixtures.refetch() }, 30000);
    }
  }, [fixtures.isError])

  useEffect( function refetchOverview() {
    if (overview.isError) {
      setTimeout(() => { overview.refetch() }, 30000);
    }
  }, [overview.isError])

  return (
    <View style={{flex: 1, backgroundColor: GlobalConstants.primaryColor}}>
      <SafeAreaView style={styles.safeArea}>
          {(overview.data && fixtures.data) &&
            <View style={{flex: 1}}>
              <View style={{height: '19%', width: '100%', zIndex: (navigation.screenType === ScreenTypes.Fixtures) ? 1 : 0}}>
                <FixturesContainer overview={overview.data} fixtures={fixtures.data}/>
              </View>
              <View style={styles.lineupView}>
                <LineupViewQueriesContainer overview={overview.data} fixtures={fixtures.data}/>
              </View>
              <PlayerStats overview={overview.data} fixtures={fixtures.data}/>
            </View>
          }

          {(fixtures.isError || overview.isError) && 
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30}}> 
              <Text style={{ alignSelf: 'center', textAlign: 'center', color: GlobalConstants.textPrimaryColor, fontSize: GlobalConstants.largeFont, fontWeight: '600' }}> 
                Please reopen the app once the gameweek has been processed by the FPL API. 
              </Text>
            </View>
          }
      </SafeAreaView>

      {(overview.data && fixtures.data) &&
        <ModalNavigator overview={overview.data} fixtures={fixtures.data}/>
      }

    </View>
  )
}

const styles = StyleSheet.create({
  
  safeArea: {
    backgroundColor: GlobalConstants.primaryColor,
    flex: 1,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  lineupView: {
    flex: 1,
  },    
});

export default MainPage;
