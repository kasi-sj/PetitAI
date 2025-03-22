import { prisma } from '../config/db';
import { Request, Response } from 'express';
import * as userServices from '../services/user.services';
import { z } from 'zod';
import { getOrganizationPetition, getUserOrganizationsSchema, getUserPetitionsSchema } from '../validators/user';
import { getOrganizationWhereUserDonePetitions } from '../services/organization.services';
import * as petitionsServices from '../services/petition.services';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        await userServices.getAllUsers(req, res)
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        await userServices.getUserById(req, res)
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {
        await userServices.createUser(req, res)
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {

        await userServices.updateUser(req, res)
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {

        await userServices.deleteUser(req, res)
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
}

export const getUserOrganizations = async (req: z.infer<typeof getUserOrganizationsSchema>, res: Response) => {
    try {
        const { id } = req.params
        const organizations = await getOrganizationWhereUserDonePetitions(id)
        res.json({ organizations })
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
}

export const getUserPetitions = async (req: z.infer<typeof getUserPetitionsSchema>, res: Response) => {
    try {
        const { id } = req.params
        const { limit, organization, page } = req.query
        const petitions = await petitionsServices.getUserPetitions(id, organization, limit || '10', page || '1')
        res.json({ ...petitions })
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
}


export const getAdminOrganizationPetition = async (req: z.infer<typeof getOrganizationPetition>, res: Response) => {
    try {
        const { id } = req.params
        const { isPending, limit, page } = req.query
        const petitionAssignments = await petitionsServices.getAdminPetitions(id, isPending, limit || '10', page || '1')
        res.json({ ...petitionAssignments })
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
}