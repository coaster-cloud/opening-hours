import { glob } from 'glob';
import validateSchema from 'yaml-schema-validator';
import fs from 'fs';
import YAML from 'yaml';

const files = await glob("./data/**/*.yaml");

const seasonValidator = (value) => {
    return value === 'winter' || value === 'halloween' || value === 'summer'
}

const timeValidator = (value) => {
    return /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(value);
}

const dayValidator = (value) => {
    const days = value.split(',');

    const validDays = days.filter((day) => {
        return (/^\d{1,2}$/.test(day)) || (/^(\d{1,2})-(\d{1,2})$/.test(day));
    })

    return validDays.length === days.length;
}

const monthSchema = [
    {
        days: { type: String, required: true, use: { dayValidator } },
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

const months = {
    january: '01',
    february: '02',
    march: '03',
    april: '04',
    may: '05',
    june: '06',
    july: '07',
    august: '08',
    september: '09',
    october: '10',
    november: '11',
    december: '12'
}

files.forEach((filePath) => {
    const schemaErrors = validateSchema(filePath, { schema: schema })

    if (schemaErrors.length === 0) {
        const dates = [];
        const data = YAML.parse(fs.readFileSync(filePath, 'utf8'));

        Object.keys(months).forEach((month) => {
            if (Array.isArray(data.months[month])) {
                data.months[month].forEach((row) => {
                    const days = row.days.split(',');

                    days.forEach((day) => {
                        if (/^\d{1,2}$/.test(day)) {
                            day = String(day).padStart(2, '0');

                            const date = `${data.year}-${months[month]}-${day}`;

                            if (isNaN(new Date(date))) {
                                throw new Error(`Invalid resolved date '${date}'.`)
                            }

                            if (dates.includes(date)) {
                                throw new Error(`Date '${date}' multiple defined.`)
                            }

                            dates.push(date);
                        }

                        if (/^(\d{1,2})-(\d{1,2})$/.test(day)) {
                            const range = day.split('-');

                            for (let i = range[0]; i <= range[1]; i++) {
                                day = String(i).padStart(2, '0');

                                const date = `${data.year}-${months[month]}-${day}`;

                                if (isNaN(new Date(date))) {
                                    throw new Error(`Invalid resolved date '${date}'.`)
                                }

                                if (dates.includes(date)) {
                                    throw new Error(`Date '${date}' multiple defined.`)
                                }

                                dates.push(date);
                            }
                        }
                    })
                })
            }
        })
    }
})
