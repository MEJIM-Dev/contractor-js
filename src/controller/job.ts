import express, { Request, Response } from 'express';
import { find, findAll, saveJob, } from '../service/job';
import { ApiResponse } from '../dto/types';
import { JobUpdates } from '../dto/types';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const queryParams = req.query;

    const page = queryParams.page as string;
    const pageSize = queryParams.pageSize as string;

    const pageNumber = parseInt(page, 10) || 1;
    const pageSizeNumber = parseInt(pageSize, 10) || 10;

    const jobs = await findAll(pageNumber, pageSizeNumber, queryParams);
    res.status(200).json(
        ApiResponse.success(jobs, 'Jobs fetched successfully.')
    );
});

router.post('/', async (req: Request, res: Response) => {
    const body: JobUpdates = req.body;
    const job = saveJob(body);
    res.status(201).json(
        ApiResponse.success(job, 'Jobs Saved successfully.')
    );
});

export {router};