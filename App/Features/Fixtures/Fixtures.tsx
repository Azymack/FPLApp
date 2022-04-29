import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Animated } from "react-native";
import FixtureCard from './FixtureCard/FixtureCard'
import { useAppDispatch, useAppSelector } from "../../Store/hooks";
import { FplOverview } from "../../Models/FplOverview";
import { FplFixture } from "../../Models/FplFixtures";
import { changeToBudgetTeam, changeToDraftTeam, changeToEmpty, changingFixtureWhenGameweekChanged, removeFixture, TeamTypes } from "../../Store/teamSlice";
import { openInfoModal } from "../../Store/modalSlice";
import { goToFixturesScreen, goToMainScreen, ScreenTypes } from "../../Store/navigationSlice";
import { styles } from "./FixturesStyles";
import { CustomButton, ToolTip } from "../Controls";
import { getAllUserTeamInfo } from "../../Helpers/FplDataStorageService";
import { FplGameweek } from "../../Models/FplGameweek";
import globalStyles from "../../Global/GlobalStyles";
import GameweekView from "./GameweekView";
import { height, width } from "../../Global/GlobalConstants";

interface FixturesViewProp {
  overview: FplOverview;
  fixtures: FplFixture[];
  gameweek: FplGameweek;
}

function SortFixtures(fixture1: FplFixture, fixture2: FplFixture) : number {
  if (fixture1.finished_provisional !== true && fixture2.finished_provisional === true) {
    return -1;
  }
  return 0;
}

const Fixtures = ({overview, fixtures, gameweek}: FixturesViewProp) => {

  const dispatch = useAppDispatch();
  const liveGameweek = overview.events.filter((event) => { return event.is_current === true; })[0].id;
  const teamInfo = useAppSelector(state => state.team);
  const navigation = useAppSelector(state => state.navigation);

  const [isCloseButtonVisible, setIsCloseButtonVisible] = useState(false);
  const [isGameweekViewVisible, setIsGameweekViewVisible] = useState(false);

  const fixtureScrollViewRef = useRef<ScrollView>(null);
  const expandAnim = useRef(new Animated.Value(0)).current;
  
  const heightInterpolate = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['100%', (100 / 17.5 * 100).toString() + '%']
  });

  const Expand = useCallback(() => {
    Animated.spring(expandAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: false
    }).start(() => setIsCloseButtonVisible(true));
  }, []);

  const Minimize = useCallback(() => {
      Animated.spring(expandAnim, {
          toValue: 0,
          friction: 10,
          useNativeDriver: false
      }).start();
  },[]);

  const setTeam = async() => {
    let teams = await getAllUserTeamInfo();
        
    if (teams) {
      let favouriteTeam = teams.find(team => team.isFavourite === true);

      if (favouriteTeam) {
        dispatch(favouriteTeam?.isDraftTeam ? changeToDraftTeam(favouriteTeam) : changeToBudgetTeam(favouriteTeam))
      }
    } else {
      dispatch(changeToEmpty());
    }
  }

  useEffect( function setInitialData() {

      if (teamInfo.teamType === TeamTypes.Empty) {
        setTeam();
      }

    }, []);

  useEffect( function setSelectedFixture() {

      fixtureScrollViewRef.current?.scrollTo({ x:0, y:0, animated:true });

      if(teamInfo.teamType === TeamTypes.Fixture) {
        let sortedGameweekFixtures: FplFixture[] | undefined = fixtures.filter((fixture) => { return fixture.event == teamInfo.gameweek})
                                                                       .sort((fixture1, fixture2) => SortFixtures(fixture1, fixture2));
      
        if (sortedGameweekFixtures !== undefined) {

          if (sortedGameweekFixtures[0].started === true) {
            dispatch(changingFixtureWhenGameweekChanged(sortedGameweekFixtures[0]));
          } 
          else {
            setTeam();
          }                              
        }
      }

      if ((teamInfo.gameweek > liveGameweek) && (navigation.screenType !== ScreenTypes.Fixtures)) {
        dispatch(goToFixturesScreen());
      }
    }, [teamInfo.gameweek]);

    const onInfoButtonPress = useCallback(() => {
      dispatch(openInfoModal());
    }, [])

    const onCalendarButtonPress = useCallback(() => {
      if (navigation.screenType === ScreenTypes.Fixtures) {
        dispatch(goToMainScreen());
      } else {
        dispatch(goToFixturesScreen());
      }
      
    }, [navigation])

    useEffect( function openAndCloseFixtureView() {
      if (navigation.screenType === ScreenTypes.Fixtures) {
        Expand();
      } else {
        setIsCloseButtonVisible(false)
        Minimize();
      }
    }, [navigation]);

  return (
    <Animated.View style={[styles.animatedView, { height: heightInterpolate }]}>
      <View style={styles.controlsContainer}>

      <View style={styles.innerControlsContainer}>
        <View style={{flex: 1}}/>
        <TouchableOpacity style={[styles.gameweekButton]} onPress={() => setIsGameweekViewVisible(true)}>
          <Text style={styles.gameweekText}>  Gameweek {teamInfo.gameweek}  </Text>
          <Text style={styles.gameweekDropDownSymbol}>◣</Text>
        </TouchableOpacity>
        <View style={styles.buttonsContainers}>
          <View style={styles.singleButtonContainer}>
            <CustomButton image="info" buttonFunction={onInfoButtonPress}/>
          </View>
        </View>
      </View>  
        
      </View>
      <View style={{flex: 1}}>
        <ScrollView ref={fixtureScrollViewRef} 
                    horizontal={(navigation.screenType === ScreenTypes.Fixtures) ? false : true} 
                    showsHorizontalScrollIndicator={false} 
                    style={{ flex: 1, marginLeft: 2.5, marginRight: 2.5 }} 
                    contentContainerStyle={(navigation.screenType === ScreenTypes.Fixtures) ? {flex: 1, flexDirection: 'row', flexWrap: 'wrap'} : {}}
                    testID='fixturesScrollView'>
          { 
            fixtures.filter((fixture) => { return fixture.event == teamInfo.gameweek})
                    .sort((fixture1, fixture2) => SortFixtures(fixture1, fixture2))
                    .map((fixture) => { return <FixtureCard key={fixture.code} fixture={fixture} gameweekData={gameweek} overview={overview}/> })     
          }
        </ScrollView>
        { (isCloseButtonVisible && (teamInfo.gameweek <= liveGameweek)) &&
          <TouchableOpacity style={[styles.closeFixtureViewButtonContainer, globalStyles.modalShadow]} 
                            onPress={onCalendarButtonPress}>
            <Text style={styles.closeFixtureViewButtonText}>Close</Text>
          </TouchableOpacity>
        }
      </View>
      <ToolTip distanceFromRight={width * 0.15} distanceFromTop={height * 0.1} 
               distanceForArrowFromRight={width * 0.3} isVisible={isGameweekViewVisible} 
               setIsVisible={setIsGameweekViewVisible} 
               view={
               <View style={styles.gameweekViewContainer}>
                 <GameweekView isVisible={isGameweekViewVisible} setIsVisible={setIsGameweekViewVisible} liveGameweek={liveGameweek} overview={overview}/>
               </View>}/>
    </Animated.View>
  )
}

export default Fixtures;

// <