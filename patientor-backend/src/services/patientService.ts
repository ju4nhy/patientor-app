import patientsData from '../../data/patients';
import { Patient, PublicPatient, NewPatient, Entry } from '../types';
import { v4 as uuidv4 } from 'uuid';

const patients: Array<Patient> = patientsData;

const getPatients = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries
  }));
};

const findById = (id: string): Patient | undefined => {
  const patient = patients.find(patient => patient.id === id);
  return patient;
};

const addPatient = ( entry: NewPatient ): Patient => {
  const newPatient = {
    id: uuidv4(),
    entries: [],
    ...entry
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = ( entry: Entry, patient: Patient ): Entry => {
  if (patient) {
    patient.entries.push(entry);
  }
  return entry;
};

export default {
  getPatients,
  addPatient,
  findById,
  addEntry
};