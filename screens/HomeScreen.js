import React, {Component} from 'react';
import {
    ImageBackground,
    ScrollView,
    Text,
    View,
} from 'react-native';
import {style} from '../assets/styles/HomeStyle';
import {selectToneColor} from "../utils/chinese";

let axios = require("react-native-axios");
let Events = require('react-native-simple-events');


export default class HomeScreen extends Component {

    static navigationOptions = {
        title: 'Daily Chinese Sentence',
    };

    constructor() {
        super();
        this.state = {
            id: '',
            sentence: '',
            characters: '',
            traditional: '',
            simplified: '',
            pinyin: '',
            english: '',
            extraDefinition: [],  // Duplicate definitions get stored in here by id
            settings: {
                difficulty: 'easy',
                characters: ['simplified', 'traditional']  // It's easier to put this in an array, so we can loop over it
            },
            data: [],  // Get this from the api in componentDidMount
        };

        this.onPress = this.onPress.bind(this);
        this.updateSettings = this.updateSettings.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.getTopTextStyle= this.getTopTextStyle.bind(this);
    }

    componentWillMount() {

        // TODO Get the data via ajax fetch() ? Axios ?
        // TODO Get the default settings from the localStorage

        Events.on('update-settings', 'settings', this.updateSettings);

        this.fetchData();
    }

    fetchData(settings = this.state.settings) {

        let characterType = settings.characters[0];
        let difficulty = settings.difficulty;

        switch (difficulty) {
            case 'difficult':
                difficulty = '3';
                break;
            case 'intermediate':
                difficulty = '2';
                break;
            default:
                difficulty = '1';
        }

        let p = axios.get('https://www.frappantchinees.nl/api/dailychinese/' + characterType + '/' + difficulty + '/?format=json')
            .then((response) => response.data)
            .then(function success(response) {

                // Some characters have multiple definitions, we want to put them together and
                // remove them from the sentence by removing them from the data
                let last = ['the id to be overwritten', 'traditional value to be overwritten', 'simplified value to be overwritten'];
                let final = [];
                let extra = [];
                for (let character of response[0].characters.reverse()) {  // It is given to us in reversed direction
                    if (character.traditional === last[1] || character.simplified === last[2]) {
                        extra.push({'id': last[0], 'object': character})
                    } else {
                        final.push(character)
                    }
                    last = [character.id, character.traditional, character.simplified]
                }

                // Create a new object to force re-render
                this.setState({'data': final, 'extraDefinition': extra});

            }.bind(this))
            .catch(function failure(error) {
                console.log('error');
                console.log(error);
                // TODO do error handling
            });
    }

    updateSettings(settings) {
        this.setState({'settings': settings});

        // Just clear the middle text after we change the settings, because it doesn't automatically change
        this.onPress();

        // Fetch the data again
        this.fetchData(settings);
    }

    onPress(id, sentence, characters, traditional, simplified, pinyin, english) {
        this.setState(() => {

            return {
                id: id,
                sentence: sentence,
                characters: characters,
                traditional: traditional,
                simplified: simplified,
                pinyin: pinyin,
                english: english,
            };
        });
    };

    getTopTextStyle() {
        let length = this.state.data.reduce((value, character) => {
            if (typeof value === 'number') {  // The first time value is the object

                return value + character.traditional.length;
            }

            return character.traditional.length
        });

        if (length > 14) {

            return style.topTextSmall;
        }
        if (length > 10) {

            return style.topTextMedium;
        }
        if (length > 6) {

            return style.topTextBig;
        }

        return style.topText;
    }

    renderCharacters(obj) {
        // This is not the same as sentence, this is for the text that is displayed after
        // clicking on a char in the sentence. Separated logic because we might change small things in here
        let characters = [];
        let unique = [];  // Array to check if the characters are not already in here
        for (let type of this.state.settings.characters) {

            // Only uniques
            if (!unique.includes(obj[type])) {
                unique.push(obj[type]);

                // Add a divider if we are currently on the second [traditional, simplified <--] of the settings
                if (type === this.state.settings.characters[1]) {
                    characters.push(<Text key={'individual-character-separator'}
                                          style={style.separator}> • </Text>);
                }

                characters.push([...obj[type]].map((value, index) => {
                    let color = selectToneColor(obj.pinyin.match(/[aieouāēīōūáéíóúǎěǐǒǔàèìòù]+/g)[index]);

                    return (
                        <Text key={'individual-character-' + value}
                              style={style['character' + color]}>{value}</Text>
                    );
                }));
            }
        }

        return characters;
    }

    render() {

        const result = this.state.data.map((obj) => {

            // Select the color depending on the tone
            // We show the sentence only in the preferred character type --> the [0]
            let sentence = [...obj[this.state.settings.characters[0]]].map((value, index) => {

                // Select the tone color depending on the tone in the pinyin
                // We 'split' the pinyin string depending on the character index we are at
                // So we can only set the color for the current character
                // Pinyin always has 1 or more consecutive vowels, so we split on those
                let color = selectToneColor(obj.pinyin.match(/[aieouāēīōūáéíóúǎěǐǒǔàèìòù]+/g)[index]);

                return (
                    <Text key={'individual-character-' + value} style={style['character' + color]}>{value}</Text>
                );
            });

            let characters = this.renderCharacters(obj);

            // Set for each individual character, but it still works
            let topTextStyle = this.getTopTextStyle();

            return (
                <Text
                    key={'character-text-' + obj.id}
                    style={topTextStyle}
                    onPress={() => this.onPress(obj.id, sentence, characters, obj.traditional, obj.simplified, obj.pinyin, obj.english)}
                >
                    {sentence}
                </Text>
            );
        });

        // Extra definitions occur if a character has multiple definitions
        let extraDefinitions = false;

        if (this.state.extraDefinition) {
            let filtered = this.state.extraDefinition.filter((obj) => {
                if (!this.state.id) {

                    return false
                }

                return obj.id === this.state.id;
            });


            if (filtered.length > 0)
                extraDefinitions = filtered.map((obj) => {
                    let characters = this.renderCharacters(obj.object);

                    return (
                        <View key={'home-extra-' + obj.object.id} style={style.extraDefinitionInner}>
                            <Text style={style.centerTextCharacter}>{characters}</Text>
                            <Text style={style.centerTextPinyin}>{obj.object.pinyin}</Text>
                            <Text style={style.centerText}>{obj.object.english}</Text>
                        </View>
                    )
                });
        }

        return (
            <ImageBackground source={require('../assets/images/background.png')} style={style.backgroundImage}>
                <View style={style.home}>
                    <View style={style.homeTop}>
                        {result}
                    </View>

                    <View style={style.homeCenter}>
                        <ScrollView style={style.scrollView} contentContainerStyle={style.innerScrollView}>
                            <View style={style.homeCenterInner}>
                                <Text style={style.centerTextCharacter}>{this.state.characters}</Text>
                                <Text style={style.centerTextPinyin}>{this.state.pinyin}</Text>
                                <Text style={style.centerText}>{this.state.english}</Text>

                                {extraDefinitions &&
                                extraDefinitions
                                }

                            </View>
                        </ScrollView>
                    </View>

                    <View style={style.homeBottom}>
                        <Text style={style.bottomText}>Everyday a new sentence</Text>
                        <Text style={style.bottomText}>&nbsp;</Text>
                        <Text style={style.bottomText}>Touch a character to see it's definition</Text>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}