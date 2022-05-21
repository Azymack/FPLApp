import React from "react";
import { StyleSheet, View } from "react-native";
import { primaryColor } from "../../../Global/GlobalConstants";

interface ArrowWrapperProps {
    isArrowAbove?: boolean;
    distanceFromRight: number;
}

const ArrowWrapper = ({isArrowAbove = true, distanceFromRight, children} : React.PropsWithChildren<ArrowWrapperProps>) => {

    return (
        <View>
            { !isArrowAbove && children}
            <View testID="arrow" style={[styles.arrow, isArrowAbove ? styles.above : styles.below, {right: distanceFromRight}]}/>
            { isArrowAbove && children}
        </View>
    )
}

export default ArrowWrapper;

const styles = StyleSheet.create({
    arrow: {
        position: 'absolute',
        right: 0,
        height: 1,
        width: 5,
        zIndex: 100,
        borderLeftWidth:15,
        borderLeftColor:"transparent",
        borderRightWidth:15,
        borderRightColor:"transparent",
        borderBottomWidth:15,
        borderBottomColor: primaryColor,
    },

    above: {
        top: -13,
    },

    below: {
        bottom: -13,
        transform: [{rotate: "180deg"}]
    },
});