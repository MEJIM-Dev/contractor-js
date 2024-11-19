import { Request, Response, Router } from "express";
import { getContractById, getAllContracts, createNewContract, updateExistingContract, deleteContractById } from "../service/contract";
import { ApiResponse } from "../dto/types";

const router = Router();

router.get("/:id", async function getContract(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const contract = await getContractById(id);
    res.json(contract);
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
})

router.get("/", async function getContracts(req: Request, res: Response) {
  try {
    const { offset = 0, limit = 10, ...filters } = req.query;
    const contracts = await getAllContracts(Number(offset), Number(limit), filters);
    res.json(contracts);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error)
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

router.post("/", async function createContract(req: Request, res: Response) {
  try {
    const data = req.body;
    const contract = await createNewContract(data);
    res.status(201).json(contract);
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
})

router.patch("/:id", async function updateContract(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;
    const updatedContract = await updateExistingContract(id, data);
    res.json(updatedContract);
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
})

router.delete("/:id", async function deleteContract(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    await deleteContractById(id);
    res.status(204).send();
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
})

export {router}