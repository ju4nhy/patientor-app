import { v4 as uuidv4 } from 'uuid';
import { NewPatient, Diagnosis, Gender,  BaseEntry } from './types';
import { Entry, HospitalEntry, OccupationalHealthcareEntry, HealthCheckEntry, HealthCheckRating } from './types';

type NewPatientFields = { name: unknown, dateOfBirth: unknown, ssn: unknown, gender: unknown, occupation: unknown };

export const toNewPatient = ({ name, dateOfBirth, ssn, gender, occupation } : NewPatientFields): NewPatient => {
  const newPatient: NewPatient = {
    name: parseString(name),
    dateOfBirth: parseDate(dateOfBirth),
    ssn: parseSNN(ssn),
    gender: parseGender(gender),
    occupation: parseOccupation(occupation),
  };
  return newPatient;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toNewEntry = (object: any): Entry => {
    const newBaseEntry: BaseEntry = {
        id: uuidv4(),
        description: parseString(object.description),
        date: parseDate(object.date),
        specialist: parseString(object.specialist),
        diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes) || [],
    };

    if(!object.type || !isString(object.type)) {
        throw new Error('Missing entry type');
    }

    switch (object.type) {
        case "HealthCheck":
                const newHealthCheckEntry: HealthCheckEntry = {
                    ...newBaseEntry,
                    type: "HealthCheck",
                    healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
                };
                return newHealthCheckEntry;
        case "OccupationalHealthcare":
                const newOccupationalHealthcareEntry: OccupationalHealthcareEntry = {
                    ...newBaseEntry,
                    type: "OccupationalHealthcare",
                    employerName: parseString(object.employerName)
                };

                if (object.sickLeave) {
                    if (object.sickLeave.startDate.length > 0 || object.sickLeave.endDate > 0) {
                      const newOccupationalHealthcareEntryWithSickLeave: OccupationalHealthcareEntry = {
                        ...newOccupationalHealthcareEntry,
                        sickLeave: parseSickLeave(object.sickLeave.startDate, object.sickLeave.endDate),
                      };
                      return newOccupationalHealthcareEntryWithSickLeave;
                    }
                }
                return newOccupationalHealthcareEntry;
        case "Hospital":
                const hospitalEntry: HospitalEntry = {
                    ...newBaseEntry,
                    type: "Hospital",
                    discharge: {
                        date: parseDate(object.discharge.date),
                        criteria: parseString(object.discharge.criteria)
                    }
                };
                return hospitalEntry;
        default:
            throw new Error('Incorrect entry type');
      }
};

const isNumber = (num: unknown): num is number => {
    return !isNaN(Number(num));
};

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const isArray = (diagnosisCodes: unknown): diagnosisCodes is Array<Diagnosis['code']> => {
    return Array.isArray(diagnosisCodes);
};

const parseString = (name: unknown): string => {
    if (!name || !isString(name)) {
      throw new Error('Incorrect or missing name');
    }
    return name;
};

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing date');
      }
      return date;
};

const parseSNN = (ssn: unknown): string => {
    if (!ssn || !isString(ssn) || ssn.length !== 11) {
        throw new Error('Incorrect or missing ssn');
    }
    return ssn;
};

const parseOccupation = (occupation: unknown): string => {
    if (!occupation || !isString(occupation)) {
        throw new Error('Incorrect or missing occupation');
      }
      return occupation;
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const isGender = (param: any): param is Gender => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Object.values(Gender).includes(param);
};

const parseGender = (gender: unknown): Gender => {
    if (!gender || !isGender(gender)) {
        throw new Error('Incorrect or missing gender: ' + gender);
    }
    return gender;
};

const parseDiagnosisCodes = (diagnosisCodes: unknown): Array<Diagnosis['code']> => {
    if (!diagnosisCodes) {
        return [];
    }

    if (!isArray(diagnosisCodes)) {
        throw new Error('Incorrect or missing diagnosis codes: ' + diagnosisCodes);
    }
    return diagnosisCodes;
};

const parseSickLeave = (startDate: unknown, endDate: unknown) => {
    if (!startDate || !endDate) {
       throw new Error('Missing sickleave data: ' + startDate + ' ' +  endDate);
    }

    if (!parseDate(startDate) || !parseDate(endDate)) {
        throw new Error('Incorrect sickleave data: ' + startDate + ' ' +  endDate);
    }

    return {
        startDate: parseDate(startDate),
        endDate: parseDate(endDate),
    };
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
    if(!isNumber(rating)) {
       throw new Error('Incorrect or missing healthcheckrating: ' + rating);
    }
    if(rating < 0 || rating > 4) {
        throw new Error('Incorrect healthCheckRating. The approved range is between 0-4.');
    }
    return rating;
};

export default toNewPatient;