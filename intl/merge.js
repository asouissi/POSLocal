import fs from 'fs';
import {sync as globSync} from 'glob';

console.log("merging starting");

const STRING_TO_ADD = ' **';
const LANG_DIR = './src/www/i18n';
const DEFAULT_LANG = "en_US";
const PATTERN_TO_IGNORE = /.*-override.json/;

const DEFAULT_LANG_PATH = LANG_DIR + "/" + DEFAULT_LANG + ".json";
let defaultLocaleObject = JSON.parse(fs.readFileSync(DEFAULT_LANG_PATH, 'utf8'));
Object.keys(defaultLocaleObject).forEach(k => defaultLocaleObject[k] += STRING_TO_ADD);

globSync(LANG_DIR + "/*.json").filter(filename => filename != DEFAULT_LANG_PATH && !filename.match(PATTERN_TO_IGNORE)).forEach(filename => {
    console.log("updating " + filename);
    const localeObject = JSON.parse(fs.readFileSync(filename, 'utf8'));
    const newLocaleObject = Object.assign({}, defaultLocaleObject, localeObject);
    let newfileContent = "{\n";
    let keys = Object.keys(newLocaleObject).filter(k => Object.keys(defaultLocaleObject).includes(k)).sort();
    keys.forEach((key, index) => newfileContent += "\t\"" + key + "\": \"" + newLocaleObject[key] + "\"" + (index != keys.length - 1 ? "," : "") + "\n");
    newfileContent += "}\n";
    fs.writeFileSync(filename, newfileContent);
    console.log(filename + " updated");
});

console.log("merging over");