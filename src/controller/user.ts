import { Request, Response, Router } from 'express';
import { createUser, deleteUser, find, findAll, updateUser } from '../service/user';
import { ApiResponse, AuthObject, AuthRequest, UserResponseDto } from '../dto/types';
import { Profile } from '../model/model';
import { generateToken } from '../middleware/auth';

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const profileData = req.body;
    const profile: Profile = await createUser(profileData);

    const body: AuthObject = profile;
    const token = generateToken(body);

    res.status(201).json(
        ApiResponse.success(
            JSON.stringify(token), 
            'Jobs Saved successfully.'
        )
    );
  } catch (error: unknown) {
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
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const profile = await find(Number(req.params.id));
    if (!profile) {
      res.status(404).json(
        ApiResponse.error('Profile not found')
        );
    }
    
    const responseData: UserResponseDto = profile;
    res.status(200).json(
        ApiResponse.success(responseData, "success")
    );
  } catch (error: unknown) {
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
});


router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const profileData = req.body;
    const updatedProfile: Profile = await updateUser(Number(req.params.id), profileData);

    if (!updatedProfile) {
      res.status(404).json(
        ApiResponse.error('Profile not found')
      );
    }

    const responseData: UserResponseDto = updatedProfile;
    res.status(200).json(
        ApiResponse.success(responseData, "success")
    );
  } catch (error: unknown) {
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
});
  
router.delete("/:id", async (req: Request, res: Response) => {
    try {
      const deletedCount = await deleteUser(Number(req.params.id));
      
      res.status(200).json(ApiResponse.success(null, "Profile deleted successfully"));
    } catch (error) {
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
}) 

export {router}
