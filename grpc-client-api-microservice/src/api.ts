import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import './db/Connection';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// Routes
import routes from './routes';

export const api = express();
api.use(bodyParser.json());
api.use(cors());

api.use('/api', routes);