import { StyleSheet, Dimensions } from 'react-native';

const win = Dimensions.get('window');

export const style = StyleSheet.create({
    backgroundImage: {
        flex: 1,
    },
    home: {
        flex: 1,
        flexDirection: 'column',
    },
    homeTop: {
        flex: 1,
        width: win.width,
        flexDirection: 'row',
        justifyContent: 'center',  // X axis
        alignItems: 'center',  // Y axis
        alignContent: 'center',  // Y axis
    },
    homeCenter: {
        flex: 4,
    },
    homeCenterInner: {
        minHeight: 320 - 30,  // -30 moves the position a bit up if there are no extra definitions
        minWidth: win.width,
        paddingLeft: 14,
        paddingRight: 10,
        justifyContent: 'center',  // X axis
        alignItems: 'center',  // Y axis
        alignContent: 'center',  // Y axis
    },
    extraDefinitionInner: {
        flex: 1,
        paddingLeft: 14,
        paddingRight: 10,
        justifyContent: 'center',  // X axis
        alignItems: 'center',  // Y axis
        alignContent: 'center',  // Y axis
    },
    homeBottom: {
        flex: 1,
        justifyContent: 'center',  // X axis
        alignItems: 'center',  // Y axis
        alignContent: 'center',  // Y axis
    },
    scrollView: {
        flex: 1,
    },
    innerScrollView: {
        justifyContent: 'center',  // X axis
        alignItems: 'center',  // Y axis
        alignContent: 'center',  // Y axis
    },
    topText: {
        fontSize: 30,
    },
    topTextBig: {
        fontSize: 24,
    },
    topTextMedium: {
        fontSize: 18,
    },
    topTextSmall: {
        fontSize: 16,
    },
    character: {   /* No or 5th tone */
        color: '#CCCCCC',
    },
    characterRed: {  /* 1st tone */
        color: '#F2777A',
    },
    characterGreen: {  /* 2nd tone */
        color: '#99CC99',
    },
    characterBlue: {  /* 3rd tone */
        color: '#6699CC',
    },
    characterPurple: {  /* 4rd tone */
        color: '#CC99CC',
    },
    separator: {
        color: '#CCCCCC',
    },
    centerText: {
        fontSize: 20,
        color: 'white',
    },
    centerTextCharacter: {
        fontSize: 36,
        color: 'white',
    },
    centerTextPinyin: {
        fontSize: 20,
        color: '#CCCCCC',
    },
    bottomText: {
        color: 'white',
    },
});