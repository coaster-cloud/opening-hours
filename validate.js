import { glob } from 'glob';
import fs from 'fs';
import YAML from 'yaml';

const files = await glob("./data/**/*.yaml");

files.forEach((filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');

    let data = null;

    try {
        data = YAML.parse(content);
    } catch (error) {
        throw new Error(`YAML file '${filePath}' is invalid. ${error}`);
    }


})
