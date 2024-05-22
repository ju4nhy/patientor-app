import React from "react";
import { useStateValue } from "../state";
import { Grid, Button } from "@material-ui/core";
import { Field, Formik, Form } from "formik";
import { TextField, DiagnosisSelection, HealthCheckRatingOption, SelectField, TypeOption } from "../AddPatientModal/FormField";
import { BaseEntry, HealthCheckRating, EntryType } from "../types";

export type EntryFormValues = Omit<BaseEntry, "id">;

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const healthCheckRatingOptions: HealthCheckRatingOption[] = [
  { value: HealthCheckRating.Healthy, label: "0 - Healthy" },
  { value: HealthCheckRating.LowRisk, label: "1 - Low Risk" },
  { value: HealthCheckRating.HighRisk, label: "2 - High Risk" },
  { value: HealthCheckRating.CriticalRisk, label: "3 - Critical Risk" },
  { value: HealthCheckRating.DeathDanger, label: "4 - Death Danger" },
];

const typeOptions: TypeOption[] = [
  { value: EntryType.Hospital, label: "Hospital" },
  { value: EntryType.OccupationalHealthCare, label: "Occupational Healthcare" },
  { value: EntryType.HealthCheck, label: "Healthcheck" },
];

const healthCheckValues = {
  healthCheckRating: 0
};

const hospitalValues = {
  discharge: {
    date: '',
    criteria: ''
  }
};

const occupationalHealthcareValues = {
  employerName: '',
  sickLeave: {
    startDate: '',
    endDate: '',
  }
};

const DefaultFields = () => {
  return <>
    <Field label="Description" placeholder="Description" name="description" component={TextField} />
    <Field label="Date" placeholder="YYYY-MM-DD" name="date" component={TextField} />
    <Field label="Specialist" placeholder="Specialist" name="specialist" component={TextField} /> 
    <SelectField label="Type" name="type" options={typeOptions} />
    </>;
};

const HealthCheckFields = () => {
  return <SelectField label="HealthCheckRating" name="healthCheckRating" options={healthCheckRatingOptions} />;
};

const HospitalFields = () => {
  return <>
        <b>Discharge:</b>
        <Field label="Date" placeholder="YYYY-MM-DD" name="discharge.date" component={TextField} />
        <Field label="Criteria" placeholder="YYYY-MM-DD" name="discharge.criteria" component={TextField} />
        </>;
};

const OccupationalHealthcareFields = () => {
  return <>
        <Field label="employerName" placeholder="Employer name" name="employerName" component={TextField} />
        <b>Sick Leave:</b>
        <Field label="Start date" placeholder="YYYY-MM-DD" name="sickLeave.startDate" component={TextField} />
        <Field label="End date" placeholder="YYYY-MM-DD" name="sickLeave.endDate" component={TextField} />
        </>;
};

export const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Formik
      initialValues={{
        description: "",
        date: "",
        specialist: "",
        diagnosisCodes: [],
        type: "HealthCheck" || "Hospital" || "OccupationalHealthcare",
        ...healthCheckValues,
        ...hospitalValues,
        ...occupationalHealthcareValues
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required";
        const formattingError = "Field is formatted incorrectly";
        const errors: { [field: string]: string | { [field: string]: string } } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (typeof values.description !== 'string') {
          errors.description = formattingError;
        }
        if (!values.date) {
          errors.date = requiredError;
        } else if (!Date.parse(values.date)) {
          errors.date = formattingError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        } 
        if (typeof values.specialist !== 'string') {
          errors.specialist = formattingError;
        }
        if (!values.type) {
          errors.type = requiredError;
        }

        if (values.type === "HealthCheck") {
          if(values.healthCheckRating < 0 || values.healthCheckRating > 4) {
            errors.healthCheckRating = formattingError;
          }
        }
        
        if (values.type === "Hospital") {
          if (!values.discharge.date) { 
            errors.discharge = { ...errors.discharge as object, date: requiredError }; 
          } else if (!Date.parse(values.discharge.date)) {
            errors.discharge = { ...errors.discharge as object, date: formattingError }; 
          }

          if (!values.discharge.criteria) { 
            errors.discharge = { ...errors.discharge as object, criteria: requiredError };
          } else if (typeof values.discharge.criteria !== 'string') {
            errors.discharge = { ...errors.discharge as object, criteria: formattingError };
          }
        }

        if (values.type === "OccupationalHealthcare") {
          if (!values.employerName) {
            errors.employerName = requiredError;
          }
          if (typeof values.employerName !== 'string') {
            errors.employerName = formattingError;
          }
          
          if (values.sickLeave.startDate) {
            if (!Date.parse(values.sickLeave.startDate)) {
              errors.sickLeave = { ...errors.sickLeave as object, startDate: formattingError };
            }
          }

          if (values.sickLeave.endDate) {
            if (!Date.parse(values.sickLeave.endDate)) {
              errors.sickLeave = { ...errors.sickLeave as object, endDate: formattingError };
            }
          }
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {
        switch(values.type) {
          case "Hospital": 
            return <> 
                    <Form className="form ui">
                      <DefaultFields />
                      <DiagnosisSelection setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} diagnoses={Object.values(diagnoses)} />
                      <HospitalFields />
                      <Grid>
                        <Grid item>
                          <Button color="secondary" variant="contained" style={{ float: "left" }} type="button" onClick={onCancel}>Cancel</Button>
                        </Grid>
                        <Grid item>
                          <Button style={{ float: "right" }} type="submit" color="primary" variant="contained" disabled={!dirty || !isValid}>Add Entry</Button>
                        </Grid>
                      </Grid>
                    </Form>
                   </>;
          case "OccupationalHealthcare":
            return <> 
                    <Form className="form ui">
                      <DefaultFields />
                      <DiagnosisSelection setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} diagnoses={Object.values(diagnoses)}/>
                      <OccupationalHealthcareFields />
                      <Grid>
                        <Grid item>
                          <Button color="secondary" variant="contained" style={{ float: "left" }} type="button" onClick={onCancel}>Cancel</Button>
                        </Grid>
                        <Grid item>
                          <Button style={{ float: "right" }} type="submit" variant="contained" color="primary" disabled={!dirty || !isValid}>Add Entry</Button>
                        </Grid>
                      </Grid>
                    </Form>
                  </>;
          case "HealthCheck":
            return <> 
                    <Form className="form ui">
                      <DefaultFields />
                      <DiagnosisSelection setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} diagnoses={Object.values(diagnoses)} />
                      <HealthCheckFields />
                      <Grid>
                        <Grid item>
                          <Button color="secondary" variant="contained" style={{ float: "left" }} type="button" onClick={onCancel}>Cancel</Button>
                        </Grid>
                        <Grid item>
                          <Button style={{ float: "right" }} color="primary" type="submit" variant="contained" disabled={!dirty || !isValid}>Add Entry</Button>
                        </Grid>
                      </Grid>
                  </Form>
                  </>;
          default: 
            return null;
        }
      }}
    </Formik>
  );
};

export default AddEntryForm;