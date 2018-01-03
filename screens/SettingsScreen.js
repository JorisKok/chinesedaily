import React from 'react';
import {
    AsyncStorage,
    Picker,
    Text,
    View,
} from 'react-native';
import {style} from '../assets/styles/SettingsStyle';
let Events = require('react-native-simple-events');


export default class SettingsScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            difficulty: '',
            characters: [],  // It's easier to put this in an array, so we can loop over it
        }
    }

    static navigationOptions = {
        title: 'Settings',
    };

    componentWillMount() {
        try {
            let p1 = AsyncStorage.getItem('@dailychinese:difficulty');

            let p2 = AsyncStorage.getItem('@dailychinese:characters');

            Promise.all([p1, p2]).then(function (values) {
                let difficulty = values[0];
                let characters = values[1].split('/');
                let state = Object.assign({}, this.state);
                if (characters.includes('traditional') || characters.includes('simplified')) {
                    state['characters'] = characters;
                }
                if (['easy', 'intermediate', 'difficult'].includes(difficulty)) {
                    state['difficulty'] = difficulty;
                }

                this.setState(state);
            }.bind(this));

        } catch (error) {
            // Error retrieving data
            // It still works, but forgets the user settings each time it restarts...
        }
    }

    storeDifficulty(value) {
        this.setState({difficulty: value});

        // Pass it to the other views, but don't just pass the this.state as it won't yet be updated
        Events.trigger('update-settings', { ...this.state, difficulty: value });

        // Store it
        try {
            AsyncStorage.setItem('@dailychinese:difficulty', value);
        } catch (error) {
            // Error saving data
        }
    }

    storeCharacters(value) {
        this.setState({characters: value.split('/')});

        // Pass it to the other views, but don't just pass the this.state as it won't yet be updated
        Events.trigger('update-settings', { ...this.state, characters: value.split('/') } );

        // Store it
        try {
            AsyncStorage.setItem('@dailychinese:characters', value);  // Can't store value as array
        } catch (error) {
            // Error saving data
        }
    }

    render() {

        return (
            <View key='settings-view' style={style.pickerView}>
                <Text style={style.pickerHeader}>
                    Select a difficulty
                </Text>

                <Text style={style.hr}>&nbsp;{/* These borders are easier than the normal border css */}</Text>

                <Picker
                    key='settings-picker-difficulty'
                    style={style.picker}
                    selectedValue={this.state.difficulty}
                    onValueChange={(value) => this.storeDifficulty(value)}>
                    <Picker.Item key='easy' label='Easy' value='easy'/>
                    <Picker.Item key='intermediate' label='Intermediate' value='intermediate'/>
                    <Picker.Item key='difficult' label='Difficult' value='difficult'/>
                </Picker>

                <Text style={style.hr}>&nbsp;{/* These borders are easier than the normal border css */}</Text>

                <Text style={style.pickerHeader}>
                    Select character display type
                </Text>

                <Text style={style.hr}>&nbsp;{/* These borders are easier than the normal border css */}</Text>

                <Picker
                    key='settings-picker-characters'
                    style={style.picker}
                    selectedValue={this.state.characters.join('/')}
                    onValueChange={(value) => this.storeCharacters(value)}>
                    <Picker.Item key='settings-st' label='Simplified/Traditional'
                                 value='simplified/traditional'/>
                    <Picker.Item key='settings-ts' label='Traditional/Simplified'
                                 value='traditional/simplified'/>
                    <Picker.Item key='settings-s' label='Simplified' value='simplified'/>
                    <Picker.Item key='settings-t' label='Traditional' value='traditional'/>
                </Picker>

                <Text style={style.hr}>&nbsp;{/* These borders are easier than the normal border css */}</Text>
                <Text style={style.hr}>&nbsp;{/* These borders are easier than the normal border css */}</Text>

            </View>
        );
    }
}


