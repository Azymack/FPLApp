import { StyleSheet } from "react-native";
import { moderateScale, moderateVerticalScale } from "react-native-size-matters";
import { aLittleLighterColor, cornerRadius, height, largeFont, mediumFont, primaryColor, secondaryColor, smallFont, textPrimaryColor, textSecondaryColor } from "../../Global/GlobalConstants";

export const styles = StyleSheet.create({
    
    container: {
        width: '100%',
        height: '100%',
        paddingTop: moderateVerticalScale(10),
        paddingBottom: moderateVerticalScale(10),
        paddingLeft: moderateScale(5),
        paddingRight: moderateScale(5),
    },

    titleText: {
        fontSize: largeFont * 1.2,
        color: textPrimaryColor, 
        fontWeight: '600',
        textAlign: 'center',
        paddingBottom: moderateVerticalScale(15),
        paddingTop: moderateVerticalScale(10)
    },

    text: {
        color: textPrimaryColor,
        fontSize: mediumFont * 0.9,
        fontWeight: '500',
    },

    controlsOuterContainers: {
        marginBottom: moderateVerticalScale(15),
        marginTop: moderateVerticalScale(10),
        height: moderateVerticalScale(35, 0.2),
        width: '100%',
    },

    controlContainer: {
        width: '60%',
        height: '100%',
        aspectRatio: 5,
        flexDirection: 'row',
        alignSelf: 'center',
        backgroundColor: secondaryColor,
        borderRadius: cornerRadius,
    },

    switch: {
        width: '33.3333%',
        height: '100%',
        backgroundColor: primaryColor,
        position: 'absolute',
        zIndex: 1,
        borderRadius: cornerRadius,
    },

    controlButtons: {
        flex: 1,
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 100,
    },

    controlText: {
        textAlign: 'center',
        color: textSecondaryColor,
        fontWeight: '600',
        fontSize: mediumFont * 0.9,
    },

    editButtonContainer: {
        position: 'absolute',
        left: 0,
        top: '15%',
        height: '80%',
        width: moderateScale(25),
        justifyContent: 'center',
    },

    filterButtonContainer: {
        position: 'absolute', 
        right: 0, 
        top: '10%', 
        height: '80%', 
        width: moderateScale(25),
        marginTop: moderateVerticalScale(3),
    },

    button: {
        width: moderateScale(100, 0.4),
        backgroundColor: secondaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: cornerRadius,
        marginBottom: moderateVerticalScale(5),
        marginTop: moderateVerticalScale(10),
        padding: moderateScale(10, 0.2),
        alignSelf: 'center'
    },

    buttonText: {
        color: textPrimaryColor,
        fontWeight: '500',
        fontSize: mediumFont,
    },

    searchBox: {
        flex: 1,
        alignSelf: 'center',
        color: textPrimaryColor,
    },
});