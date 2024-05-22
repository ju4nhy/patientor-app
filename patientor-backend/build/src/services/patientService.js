"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const patients_1 = __importDefault(require("../../data/patients"));
const uuid_1 = require("uuid");
const patients = patients_1.default;
const getPatients = () => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation,
        entries
    }));
};
const findById = (id) => {
    const patient = patients.find(patient => patient.id === id);
    return patient;
};
const addPatient = (entry) => {
    const newPatient = Object.assign({ id: (0, uuid_1.v4)(), entries: [] }, entry);
    patients.push(newPatient);
    return newPatient;
};
const addEntry = (entry, patient) => {
    if (patient) {
        patient.entries.push(entry);
    }
    return entry;
};
exports.default = {
    getPatients,
    addPatient,
    findById,
    addEntry
};
