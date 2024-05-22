import axios from 'axios';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { useStateValue, setPatient, addEntry } from "../state";
import { Patient, Gender } from "../types";
import { apiBaseUrl } from "../constants";
import EntryDetails from "../components/EntryDetails";
import { Button } from "@material-ui/core";
import { EntryFormValues } from "../AddEntryModal/AddEntryForm";
import AddEntryModal from "../AddEntryModal";

const PatientPage = () => {
  const [{ patient }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>();

  useEffect(() => {
    const fetchPatient = async () => {
      if (patient && patient.id === id) return null;
    
      if (id) {
        try {
          const { data: patient } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
          dispatch(setPatient(patient));
        } catch (e: unknown) {
          console.error(e);
        }
      }
    };
    void fetchPatient();
  }, [patient]);

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    if (!patient) return null;
    if (id) {
      try {
        const { data: newEntry } = await axios.post<Patient>(`${apiBaseUrl}/patients/${id}/entries`, values);
        dispatch(addEntry(newEntry));
        const { data: updatedPatient } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        dispatch(setPatient(updatedPatient));
        closeModal();
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          console.error(e?.response?.data || "Unrecognized axios error");
          setError(String(e?.response?.data?.error) || "Unrecognized axios error");
        } else {
          console.error("Unknown error", e);
          setError("Unknown error");
        }
      }
    }
    return;
  };

  if (!patient) {
    return <h2>Patient not found!</h2>;
  }

 const formGenderIcon = () => {
    switch(patient.gender) {
      case 'male':
        return <span className="material-symbols-outlined">{Gender.Male}</span>;
      case 'female':
        return <span className="material-symbols-outlined">{Gender.Female}</span>;
      case 'other':
        return <span className="material-symbols-outlined">{Gender.Other}</span>;
      default:
        throw new Error('Gender not found');
    }
 };

 return (
      <>
      <div className="patientinfo" style={{marginTop: 40 }}>
          <h2 style={{ color: 'darkblue'}}>{patient.name}</h2> 
          {formGenderIcon()}
          <h4>occupation: {patient.occupation}</h4>
          <h4>ssn: {patient.ssn}</h4>
      </div> 
      <EntryDetails />
      <Button variant="contained" style={{ marginBottom: 10}} color="primary" onClick={() => openModal()}>Add New Entry</Button>
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      </>
  ); 
};
  
export default PatientPage;