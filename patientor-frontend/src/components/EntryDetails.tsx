import React from 'react';
import { useStateValue} from "../state";
import { Entry } from "../types";
import HealthRatingBar from "./HealthRatingBar";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryDetails = () => {
  const [{ patient }] = useStateValue();
  const [{ diagnoses }] = useStateValue();

  if (!patient) {
      return <h2>Entry details not found!</h2>;
  }

  const HospitalPage = ( entry: Entry ) => {
    return <> 
      <div key={entry.id} style={{ width: '600px', border: '3px solid darkblue', marginBottom: '15px', background: '#F8FDFF' }}>
        <div style={{background: '#C6EFFF', display: "flex"}}>
            <span className="material-symbols-outlined" style={{ fontSize: '30px', marginTop: 10, marginRight: 10, marginLeft: 10}}>medical_services</span>
            <p style={{fontSize: '16px'}}><b>{entry.date}</b></p>
        </div>
        <div style={{ marginLeft: 15, marginTop: 15 }}>
            <i>{entry.description}</i> 
            <p>diagnose by <b>{entry.specialist}</b></p>
            {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 ?
              <>
                {entry.diagnosisCodes?.map(code => {
                    const name = diagnoses[code];
                    if (name) {
                      return <li key={code}>{code}: {diagnoses[code].name}</li>;
                    } else {
                      return <li key={name}>{code}</li>;
                    }
                })}
              </> : null}    
              {entry.type === "Hospital" && entry.discharge ? <p>Discharge: {entry.discharge.date} {entry.discharge.criteria}</p> : null}
          </div>
      </div>
    </>;
  };

 const OccupationalHealthCarePage = ( entry: Entry ) => {
    return <>
       <div key={entry.id} style={{ width: '600px', border: '3px solid darkblue', marginBottom: '15px', background: '#F8FDFF'}}>
            <div style={{background: '#C6EFFF', display: "flex"}}>
                <span className="material-symbols-outlined" style={{ fontSize: '30px', marginTop: 12, marginRight: 10, marginLeft: 10}}>crop_5_4</span>
                <p style={{fontSize: '16px'}}><b>{entry.date}</b></p>
                {entry.type === "OccupationalHealthcare" && entry.employerName ? <p style={{ marginLeft: 10 }}><i>{entry.employerName}</i></p> : null}
            </div>
            <div style={{ marginLeft: 15, marginTop: 15 }}>
              <i>{entry.description}</i> 
              <p>diagnose by <b>{entry.specialist}</b></p>
              {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 ?
                <>
                  {entry.diagnosisCodes?.map(code => {
                      const name = diagnoses[code];
                      if (name) {
                        return <li key={code}>{code}: {diagnoses[code].name}</li>;
                      } else {
                        return <li key={name}>{code}</li>;
                      }
                  })}
                  <br />
                </> : null}   
                {entry.type === "OccupationalHealthcare" && entry.sickLeave? <p>Sickleave: {entry.sickLeave?.startDate} - {entry.sickLeave?.endDate}</p> : null}
           </div>
        </div>   
      </>;
 };


 const HealthCheckPage = (entry: Entry) => {
  return <>
          <div key={entry.id} style={{ width: '600px', border: '3px solid darkblue', marginBottom: '15px', background: '#F8FDFF' }}>
              <div style={{background: '#C6EFFF', display: "flex"}}>
                  <span className="material-symbols-outlined" style={{ fontSize: '30px', marginTop: 12, marginLeft: 10, marginRight: 10}}>local_hospital</span>
                  <p style={{fontSize: '16px'}}><b>{entry.date}</b></p>
              </div>
              <div style={{ marginLeft: 15, marginTop: 15 }}>
                  <i>{entry.description}</i> 
                  {entry.type === "HealthCheck" && entry.healthCheckRating >= 0 ? 
                    <HealthRatingBar rating={entry.healthCheckRating} showText={true} /> 
                  : null}
                  <p>diagnose by <b>{entry.specialist}</b></p>
                  {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 ?
                  <>
                    {entry.diagnosisCodes?.map(code => {
                        const name = diagnoses[code];
                        if (name) {
                          return <li key={code}>{code}: {diagnoses[code].name}</li>;
                        } else {
                          return <li key={code}>{code}</li>;
                        }
                    })}
                    <br />
                  </> : null} 
              </div>
          </div>
        </>;
 };

  const formEntryDetails = patient.entries.map((entry: Entry) => {
      switch(entry.type) {
        case "Hospital":
          return <HospitalPage key={entry.id} { ...entry }/>;
        case "OccupationalHealthcare":
          return <OccupationalHealthCarePage key={entry.id} { ...entry }/>;
        case "HealthCheck":
          return <HealthCheckPage key={entry.id} {...entry} />;
        default:
          return assertNever(entry);
      }
   });

  return (
    <div className="entryDetails">
        {patient.entries.length !== 0 ? 
          <div className="entries" style={{ marginTop: 30, marginBottom: 15 }}>
              <h3 style={{ color: 'darkblue' }}>Entries</h3>
              {formEntryDetails}
          </div>
        : null }
    </div>
  );
};
  
export default EntryDetails;