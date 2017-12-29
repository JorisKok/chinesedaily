/*  All tones excluding no tone
    ā, ē, ī, ō, ū
    á, é, í, ó, ú
    ǎ, ě, ǐ, ǒ, ǔ
    à, è, ì, ò, ù
*/

export function selectToneColor(character) {

    switch (character) {
        case 'ā':
        case 'ē':
        case 'ī':
        case 'ō':
        case 'ū':

            return 'Red';  // First tone

        case 'á':
        case 'é':
        case 'í':
        case 'ó':
        case 'ú':

            return 'Green';  // Second tone

        case 'ǎ':
        case 'ě':
        case 'ǐ':
        case 'ǒ':
        case 'ǔ':

            return 'Blue';  // Third tone

        case 'à':
        case 'è':
        case 'ì':
        case 'ò':
        case 'ù':

            return 'Purple';  // Fourth tone

        default:

            return '';  // Fifth or no tone
    }
}