import {StyleSheet} from "react-native";


export const style = StyleSheet.create({
    pickerView: {
        flex: 1,
        backgroundColor: 'white',
    },
    picker: {
        borderWidth: 0,
        borderColor: '#ededed',
        paddingHorizontal: 8,
    },
    pickerHeader: {
        height: 30,
        fontSize: 12,
        color: 'gray',
        textAlignVertical: 'center',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ededed',
        paddingHorizontal: 8,
    },
    hr: {
        height: 0,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#ededed',
    },
});
