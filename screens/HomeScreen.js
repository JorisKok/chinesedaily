import React, {Component} from 'react';
import {
    Text,
    ImageBackground,
    View,
} from 'react-native';
import {style} from '../assets/styles/HomeStyle';
import {selectToneColor} from "../utils/chinese";

let Events = require('react-native-simple-events');


export default class HomeScreen extends Component {

    static navigationOptions = {
        title: 'Daily Chinese Sentence',
    };

    constructor() {
        super();
        this.state = {
            sentence: '',
            characters: '',
            traditional: '',
            simplified: '',
            pinyin: '',
            english: '',
            settings: {
                difficulty: 'easy',
                characters: ['traditional', 'simplified']
            },
            data: [
                {id: 0, traditional: '我', simplified: '我', pinyin: 'wǒ', english: 'me'},
                {id: 1, traditional: '是', simplified: '是', pinyin: 'shī', english: 'is/are'},
                {id: 2, traditional: '荷蘭人', simplified: '荷兰人', pinyin: 'hélànren', english: 'Dutch person'}
            ],  // Get this from the api in componentDidMount

        };

        this.onPress = this.onPress.bind(this);
        this.updateSettings = this.updateSettings.bind(this);
    }

    componentDidMount() {

        // TODO Get the data via ajax fetch() ? Axios ?
        // TODO Get the default settings from the localStorage

        Events.on('update-settings', 'settings', this.updateSettings);
    }

    updateSettings(settings) {
        this.setState({'settings': settings});

        // Just clear the middle text after we change the settings, because it doesn't automatically change
        this.onPress();
    }

    onPress(sentence, characters, traditional, simplified, pinyin, english) {
        this.setState(() => {

            return {
                sentence: sentence,
                characters: characters,
                traditional: traditional,
                simplified: simplified,
                pinyin: pinyin,
                english: english,
            };
        });
    };

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

            return (
                <Text
                    key={'character-text-' + obj.id}
                    style={style.topText}
                    onPress={() => this.onPress(sentence, characters, obj.traditional, obj.simplified, obj.pinyin, obj.english)}
                >
                    {sentence}
                </Text>
            );
        });

        return (
            <ImageBackground source={require('../assets/images/background.png')} style={style.backgroundImage}>
                <View style={style.home}>
                    <View style={style.homeTop}>
                        {result}
                    </View>
                    <View style={style.homeCenter}>
                        <Text style={style.centerTextCharacter}>{this.state.characters}</Text>
                        <Text style={style.centerTextPinyin}>{this.state.pinyin}</Text>
                        <Text style={style.centerText}>{this.state.english}</Text>
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