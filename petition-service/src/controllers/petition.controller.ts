import { Request, Response } from 'express';
import * as petitionServices from '../services/petition.services';
import * as petitionOrganizationUserAssignmentServices from '../services/petition-organization-user-assignment.services';
import { z } from 'zod';
import { assignPetitionToOrgUserSchema, getMostSimilarPetitionsSchema, getPetitionSchema, updatePetitionSchema } from '../validators/petition';
export const getAllPetitions = async (req: Request, res: Response) => {
    try {
        await petitionServices.getAllPetitions(req, res);
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
};

export const getPetitionById = async (req: z.infer<typeof getPetitionSchema>, res: Response) => {
    try {
        await petitionServices.getPetitionById(req, res);
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
};

export const createPetition = async (req: Request, res: Response) => {
    try {
        await petitionServices.createPetition(req, res);
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
};

export const updatePetition = async (req: z.infer<typeof updatePetitionSchema>, res: Response) => {
    try {
        await petitionServices.updatePetition(req, res);
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
};



export const deletePetition = async (req: Request, res: Response) => {
    try {
        await petitionServices.deletePetition(req, res);
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
};

export const getMostSimilarPetition = async (req: Request, res: Response) => {
    try {
        await petitionServices.getMostSimilarPetition(req, res);
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
}

export const assignPetitionToOrgUser = async (req: z.infer<typeof assignPetitionToOrgUserSchema>, res: Response) => {
    try{
        const { id : petitionId } = req.params;
        const { organizationUserId } = req.body
        await petitionOrganizationUserAssignmentServices.assignPetitionToOrgUser(petitionId, organizationUserId , res);
    }catch(error: any){
        console.log(error)
        res.status(400).json({ message: error.message });
    }
}

export const getSimilarPetitions = async (req: z.infer<typeof getMostSimilarPetitionsSchema>, res: Response) => {
    try{
        const {id} = req.params
        const petitions = await petitionServices.getMostSimilarPetitions(id);
        res.json(petitions)
    }catch(error: any){
        console.log(error)
        res.status(400).json({ message: error.message });
    }
}