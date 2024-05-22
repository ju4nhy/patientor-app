"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNewEntry = exports.toNewPatient = void 0;
const uuid_1 = require("uuid");
const types_1 = require("./types");
const toNewPatient = ({ name, dateOfBirth, ssn, gender, occupation }) => {
    const newPatient = {
        name: parseString(name),
        dateOfBirth: parseDate(dateOfBirth),
        ssn: parseSNN(ssn),
        gender: parseGender(gender),
        occupation: parseOccupation(occupation),
    };
    return newPatient;
};
exports.toNewPatient = toNewPatient;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewEntry = (object) => {
    const newBaseEntry = {
        id: (0, uuid_1.v4)(),
        description: parseString(object.description),
        date: parseDate(object.date),
        specialist: parseString(object.specialist),
        diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes) || [],
    };
    if (!object.type || !isString(object.type)) {
        throw new Error('Missing entry type');
    }
    switch (object.type) {
        case "HealthCheck":
            const newHealthCheckEntry = Object.assign(Object.assign({}, newBaseEntry), { type: "HealthCheck", healthCheckRating: parseHealthCheckRating(object.healthCheckRating) });
            return newHealthCheckEntry;
        case "OccupationalHealthcare":
            const newOccupationalHealthcareEntry = Object.assign(Object.assign({}, newBaseEntry), { type: "OccupationalHealthcare", employerName: parseString(object.employerName) });
            if (object.sickLeave) {
                if (object.sickLeave.startDate.length > 0 || object.sickLeave.endDate > 0) {
                    const newOccupationalHealthcareEntryWithSickLeave = Object.assign(Object.assign({}, newOccupationalHealthcareEntry), { sickLeave: parseSickLeave(object.sickLeave.startDate, object.sickLeave.endDate) });
                    return newOccupationalHealthcareEntryWithSickLeave;
                }
            }
            return newOccupationalHealthcareEntry;
        case "Hospital":
            const hospitalEntry = Object.assign(Object.assign({}, newBaseEntry), { type: "Hospital", discharge: {
                    date: parseDate(object.discharge.date),
                    criteria: parseString(object.discharge.criteria)
                } });
            return hospitalEntry;
        default:
            throw new Error('Incorrect entry type');
    }
};
exports.toNewEntry = toNewEntry;
const isNumber = (num) => {
    return !isNaN(Number(num));
};
const isString = (text) => {
    return typeof text === 'string' || text instanceof String;
};
const isArray = (diagnosisCodes) => {
    return Array.isArray(diagnosisCodes);
};
const parseString = (name) => {
    if (!name || !isString(name)) {
        throw new Error('Incorrect or missing name');
    }
    return name;
};
const isDate = (date) => {
    return Boolean(Date.parse(date));
};
const parseDate = (date) => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing date');
    }
    return date;
};
const parseSNN = (ssn) => {
    if (!ssn || !isString(ssn) || ssn.length !== 11) {
        throw new Error('Incorrect or missing ssn');
    }
    return ssn;
};
const parseOccupation = (occupation) => {
    if (!occupation || !isString(occupation)) {
        throw new Error('Incorrect or missing occupation');
    }
    return occupation;
};
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const isGender = (param) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Object.values(types_1.Gender).includes(param);
};
const parseGender = (gender) => {
    if (!gender || !isGender(gender)) {
        throw new Error('Incorrect or missing gender: ' + gender);
    }
    return gender;
};
const parseDiagnosisCodes = (diagnosisCodes) => {
    if (!diagnosisCodes) {
        return [];
    }
    if (!isArray(diagnosisCodes)) {
        throw new Error('Incorrect or missing diagnosis codes: ' + diagnosisCodes);
    }
    return diagnosisCodes;
};
const parseSickLeave = (startDate, endDate) => {
    if (!startDate || !endDate) {
        throw new Error('Missing sickleave data: ' + startDate + ' ' + endDate);
    }
    if (!parseDate(startDate) || !parseDate(endDate)) {
        throw new Error('Incorrect sickleave data: ' + startDate + ' ' + endDate);
    }
    return {
        startDate: parseDate(startDate),
        endDate: parseDate(endDate),
    };
};
const parseHealthCheckRating = (rating) => {
    if (!isNumber(rating)) {
        throw new Error('Incorrect or missing healthcheckrating: ' + rating);
    }
    if (rating < 0 || rating > 4) {
        throw new Error('Incorrect healthCheckRating. The approved range is between 0-4.');
    }
    return rating;
};
exports.default = exports.toNewPatient;
