import { glob } from 'glob';
import validateSchema from 'yaml-schema-validator';

const files = await glob("./data/**/*.yaml");

const seasonValidator = (value) => {
    return value === 'winter' || value === 'halloween' || value === 'summer'
}

const timeValidator = (value) => {
    return /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(value);
}

const monthSchema = [
    {
        days: { type: String, required: true },
        from: { type: String, required: true, use: { timeValidator } },
        to: { type: String, required: true, use: { timeValidator } },
        event: { type: String, required: false },
        season: { type: String, use: { seasonValidator } },
    }
];

const schema = {
    park: { type : String, required: true },
    year: { type : Number, required: true },
    months: {
        january: monthSchema,
        february: monthSchema,
        march: monthSchema,
        april: monthSchema,
        may: monthSchema,
        june: monthSchema,
        july: monthSchema,
        august: monthSchema,
        september: monthSchema,
        october: monthSchema,
        november: monthSchema,
        december: monthSchema,
    }
}

files.forEach((filePath) => {
    validateSchema(filePath, { schema: schema })
})
