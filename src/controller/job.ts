import express, { Request, Response } from 'express';
import { find, findAll, saveJob, } from '../service/job';
import { ApiResponse, JobCreation } from '../dto/types';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const queryParams = req.query;

    try {
        const page = queryParams.page as string;
        const pageSize = queryParams.pageSize as string;

        const pageNumber = parseInt(page, 10) || 1;
        const pageSizeNumber = parseInt(pageSize, 10) || 10;

        const jobs = await findAll(pageNumber, pageSizeNumber, queryParams);
        res.status(200).json(
            ApiResponse.success(jobs, 'Jobs fetched successfully.')
        );
    } catch (e) {
        console.error(e)
        if (e instanceof Error) {
            res.status(400).json(
              ApiResponse.error(e.message)
            );
          } else {
            res.status(500).json(
              ApiResponse.error('An unknown error occurred.')
            );
        }
    }
});

router.post('/', async (req: Request, res: Response) => {
    const body: JobCreation = req.body;
    try {
        const job = await saveJob(body);
        res.status(201).json(
            ApiResponse.success(job, 'Jobs Saved successfully.')
        );
    } catch (e: unknown){
        console.error(e)
        if (e instanceof Error) {
            res.status(400).json(
              ApiResponse.error(e.message)
            );
          } else {
            res.status(500).json(
              ApiResponse.error('An unknown error occurred.')
            );
        }
    }
});

export {router};