import { glob } from 'glob';
import validateSchema from 'yaml-schema-validator';

const files = await glob("./data/**/*.yaml");

const monthSchema = [
    {
        days: { type: String, required: true },
        from: { type: String, required: true },
        to: { type: String, required: true },
        event: { type: String, required: false },
        season: { type: String, required: false },
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
