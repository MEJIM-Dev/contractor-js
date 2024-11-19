import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { sequelize } from './model/model';
import {router as JobRouter} from "./controller/job"
import {router as AuthRouter} from "./controller/auth"
import {router as UserRouter} from "./controller/user"
import {router as ContractRouter} from "./controller/contract"
import { isAuthorized } from './service/auth';
import "./job/contracts"

const app: Application = express();

app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

sequelize.sync({ force: false, alter: true })
.then(() => console.log('Database synchronized'))
.catch((error: Error) => console.error('Database synchronization failed:', error));

app.use("*", isAuthorized)
app.use("/api/jobs", JobRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/users", UserRouter);
app.use("/api/contracts", ContractRouter);

export default app;
