import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './model/model';
import {router as JobRouter} from "./controller/job"
import {router as AuthRouter} from "./controller/auth"

const app: Application = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

sequelize.sync({ force: false })
.then(() => console.log('Database synchronized'))
.catch((error: Error) => console.error('Database synchronization failed:', error));

app.use("/jobs", JobRouter);
app.use("/auth", AuthRouter);

export default app;
