// services/contractService.ts
import { findById, findAll, createContract, updateContract, deleteContract } from "../db/contract";
import { findById as findUserById } from "../db/user";
import { Contract, ContractCreationAttributes } from "../model/model";
import { ContractCreation, PagedResponse, UpdateContractResult } from "../dto/types";

export async function getContractById(id: number): Promise<Contract | null> {
  const contract = await findById(id);
  if (!contract) {
    throw new Error("Contract not found");
  }
  return contract;
}

export async function getAllContracts(offset: number, limit: number, filters: any): Promise<PagedResponse<Contract>> {
  const contracts = await findAll(offset, limit, filters);
  return contracts;
}

export async function createNewContract(data: ContractCreation): Promise<Contract> {
  //Find users
  const contractor = await findUserById(data.contractorId);
  if(contractor==null){
      throw new Error("Invalid Contractor")
  }

  const client = await findUserById(data.clientId);
  if(client==null){
      throw new Error("Invalid Client")
  }

  const createContractData: ContractCreationAttributes = {terms: data.terms, status: data.status, ContractorId: data.contractorId, ClientId: data.clientId};
  const contract = await createContract(createContractData);
  if (!contract) {
    throw new Error("Failed to create contract");
  }
  return contract;
}

export async function updateExistingContract(id: number, data: any): Promise<Contract | null> {
  const res: UpdateContractResult = await updateContract(id, data);
  const { affectedCount: affectedRows, updatedContract: updatedContracts } = res;
  if (affectedRows === 0) {
    throw new Error("Failed to update contract or no changes made");
  }
  return updatedContracts;
}

export async function deleteContractById(id: number): Promise<void> {
  const deleted = await deleteContract(id);
  if (!deleted) {
    throw new Error("Failed to delete contract");
  }
}
