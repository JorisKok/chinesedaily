import React, {Component} from 'react';
import {
    AsyncStorage,
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
                difficulty: '',
                characters: []  // It's easier to put this in an array, so we can loop over it
            },
            data: [],  // Get this from the api in componentDidMount
            error: false,
        };

        this.onPress = this.onPress.bind(this);
        this.updateSettings = this.updateSettings.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.getTopTextStyle = this.getTopTextStyle.bind(this);
    }

    componentWillMount() {

        // Get the state.settings from the storage
        try {
            let p1 = AsyncStorage.getItem('@dailychinese:difficulty');
            let p2 = AsyncStorage.getItem('@dailychinese:characters');

            Promise.all([p1, p2])
                .then(function (values) {
                    let difficulty = values[0] ? values[0] : 'easy';
                    let characters = values[1] ? values[1].split('/') : ['simplified', 'traditional'];
                    let settings = Object.assign({}, this.state.settings);
                    if (characters.includes('traditional') || characters.includes('simplified')) {
                        settings['characters'] = characters;
                    }
                    if (['easy', 'intermediate', 'difficult'].includes(difficulty)) {
                        settings['difficulty'] = difficulty;
                    }
                    this.setState({'settings': settings});

                    this.fetchData(settings);

                }.bind(this))
                .catch(function (error) {
                    // TODO implement error handling
                });

        } catch (error) {
            // Error retrieving data
            // It still works, but forgets the user settings each time it restarts...
            // TODO implement error handling
        }

        Events.on('update-settings', 'settings', this.updateSettings);
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
            .catch(function failure() {
                this.setState({'data': [], 'error': true});
            }.bind(this));
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

                let realIndex = 0;
                characters.push([obj[type]].map((value, index) => {  // This maps per character but also per word!!

                    let result = [];
                    for (let i = 0; i < value.length; i++) {

                        let color = selectToneColor(obj.pinyin.match(/[aieouāēīōūáéíóúǎěǐǒǔàèìòù]+/g)[realIndex]);

                        result.push(
                            <Text key={'individual-character-' + value[i]}
                                  style={style['character' + color]}>{value[i]}</Text>
                        );

                        realIndex += 1;  // This index counts only the characters and not the words (2 char together etc)
                    }

                    return (
                        <Text key={'individual-word-' + value}>{result}</Text>
                    );
                }));
            }
        }

        return characters;
    }

    render() {

        let result = this.state.data.map((obj) => {

            // Select the color depending on the tone
            // We show the sentence only in the preferred character type --> the [0]
            let realIndex = 0;
            let sentence = [obj[this.state.settings.characters[0]]].map((value, index) => {  // This maps per character but also per word!!

                let result = [];
                for (let i = 0; i < value.length; i++) {

                    // Select the tone color depending on the tone in the pinyin
                    // We 'split' the pinyin string depending on the character index we are at
                    // So we can only set the color for the current character
                    // Pinyin always has 1 or more consecutive vowels, so we split on those
                    let color = selectToneColor(obj.pinyin.match(/[aieouāēīōūáéíóúǎěǐǒǔàèìòù]+/g)[realIndex]);

                    result.push(
                        <Text key={'sentence-individual-character-' + value[i]}
                              style={style['character' + color]}>{value[i]}</Text>
                    );

                    realIndex += 1;  // This index counts only the characters and not the words (2 char together etc)
                }

                return (
                    <Text key={'sentence-individual-word-' + value}>{result}</Text>
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

        if (result.length === 0) {
            result = <Text style={style.loadingText}>Loading sentence...</Text>
        }

        if (this.state.error) {
            result = <View style={style.errorView}>
                <Text style={style.errorText}>Something went wrong.</Text>
                <Text style={style.errorText}>Check your internet connection or try again later.</Text>
            </View>
        }

        let english = this.state.english ? this.state.english.split('/').join('\n') : '';

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
                                <Text style={style.centerText}>{english}</Text>

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