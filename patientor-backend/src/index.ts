/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires*/
import express from 'express';
import diagnoseRouter from './routes/diagnosesRouter';
import patientRouter from './routes/patientsRouter';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors());

 /* FOR PRODUCTION BUILD:

app.use(cors({
  origin: 'http://localhost:5000'
}));

*/

const PORT = 3000;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong. There will be patientor app!');
});

app.use('/api/diagnoses', diagnoseRouter);
app.use('/api/patients', patientRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});