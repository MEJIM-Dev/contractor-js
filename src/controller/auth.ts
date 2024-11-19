import { Router, Request, Response} from 'express';
import { authenticateUser } from '../util/auth';
import { ApiResponse, AuthRequest } from '../dto/types';
import { generateToken } from '../middleware/auth';
const router = Router();

router.post('/login', async (req: Request, res: Response) => {
    const body: AuthRequest = req.body;

    try {
        const user = await authenticateUser(body);
  
        const token = generateToken(user);

        res.json(
            ApiResponse.success(token, 'Login successful')
        );
    } catch(e: unknown) {
        console.error(e)
        res.status(401).json(
            ApiResponse.error('Invalid credentials')
        );
    }
});
  
export {router};