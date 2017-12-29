import { StyleSheet } from 'react-native';


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
        flexDirection: 'row',
        justifyContent: 'center',  // X axis
        alignItems: 'center',  // Y axis
        alignContent: 'center',  // Y axis
    },
    homeCenter: {
        flex: 4,
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
    character: {
        flex: 1,
    },
    topText: {
        fontSize: 40,
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
        fontSize: 26,
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