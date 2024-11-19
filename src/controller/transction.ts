import { Router, Request, Response } from "express";
import { ApiResponse } from "../dto/types";
import { debit as debitUser, credit as creditUser, transferFunds} from "../service/transction"

const router = Router();

router.post("debit", async function (req: Request, res: Response): Promise<void> {
    const { profileId, amount } = req.body;

    try {
      const updatedProfile = await debitUser(profileId, amount);
      res.status(200).json(updatedProfile);
    } catch (error) {
        console.error(error)
        if (error instanceof Error) {
            res.status(400).json(
              ApiResponse.error(error.message)
            );
          } else {
            res.status(500).json(
              ApiResponse.error('An unknown error occurred.')
            );
            }
        }
    }
)

router.post('/credit', async function (req: Request, res: Response): Promise<void> {
    const { profileId, amount } = req.body;
    
    try {
      const updatedProfile = await creditUser(profileId, amount);
      res.status(200).json(updatedProfile);
    } catch (error) {
        console.error(error)
        if (error instanceof Error) {
            res.status(400).json(
              ApiResponse.error(error.message)
            );
          } else {
            res.status(500).json(
              ApiResponse.error('An unknown error occurred.')
            );
        }
    }
  }
);

router.post("/transfer", async function (req: Request, res: Response): Promise<void> {
    const { profileId, amount } = req.body;
    
    try {
        if(req.user == undefined){
            throw Error("Unauthorized")
        }
        const updatedProfile = await transferFunds(req.user.id, profileId, amount, );
        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error(error)
        if (error instanceof Error) {
            res.status(400).json(
              ApiResponse.error(error.message)
            );
          } else {
            res.status(500).json(
              ApiResponse.error('An unknown error occurred.')
            );
        }
    }
  }
);

export {router};