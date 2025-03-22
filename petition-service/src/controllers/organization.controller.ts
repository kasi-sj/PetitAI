import { prisma } from '../config/db';
import { Request, Response } from 'express';
import * as organizationService from '../services/organization.services';
import * as departmentServices from '../services/department.services'
import * as roleServices from '../services/role.services'
import * as organizationUserServices from '../services/organization-user.services'
import { z } from 'zod';
import { getAllOrganizationsSchema, getOrganizationDepartmentsSchema, getOrganizationRolesSchema, getPetitionCountByDepartmentSchema, getPetitionCountSchema, updateOrganizationSchema } from '../validators/organization';
import * as petitionServices from '../services/petition.services';

export const getAllOrganizations = async (req: z.infer<typeof getAllOrganizationsSchema>, res: Response) => {
    try {
        await organizationService.getAllOrganizations(req, res);
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
}
export const getOrganizationById = async (req: Request, res: Response) => {
    try {
        await organizationService.getOrganizationById(req, res);
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
}

export const createOrganization = async (req: Request, res: Response) => {
    try {
        await organizationService.createOrganization(req, res);
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
}

export const updateOrganization = async (req: z.infer<typeof updateOrganizationSchema>, res: Response) => {
    try {
        await organizationService.updateOrganization(req, res);
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
}

export const deleteOrganization = async (req: Request, res: Response) => {
    try {
        await organizationService.deleteOrganization(req, res);
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
}

export const getOrganizationDepartments = async (req: z.infer<typeof getOrganizationDepartmentsSchema>, res: Response) => {
    try {
        const { id } = req.params
        const { limit, page, search , pagination } = req.query;
        const departments = await departmentServices.getDepartmentsByOrganizationId(id, Number(limit), Number(page), search as string , pagination)
        res.json({ departments })
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
}

export const getOrganizationByName = async (req: Request, res: Response) => {
    try {
        await organizationService.getOrganizationByName(req, res);
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
}

export const getOrganizationRoles = async (req: z.infer<typeof getOrganizationRolesSchema>, res: Response) => {
    try {
        const { id } = req.params;
        const { limit, page, search } = req.query;
        const roles = await roleServices.getRolesByOrganizationId(id, Number(limit), Number(page), search as string)
        res.json({ roles })
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
}

export const getOrganizationUsers = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { limit, page, search } = req.query;
        const result = await organizationUserServices.getOrganizationUsersByOrganizationId(id, Number(limit), Number(page), search as string)
        res.json({ ...result })
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
}

export const getPetitionCount = async (req : z.infer<typeof getPetitionCountSchema> , res : Response) => {
    try {
        const { id } = req.params;
        const { from , to , organizationUserId , departmentId} = req.query;
        console.log(id , departmentId , organizationUserId , from , to)
        const results = await petitionServices.getPetitionCount(id , departmentId , organizationUserId, from as string , to as string)
        res.json(results)
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
}

export const getPetitionCountByDepartment = async (req: z.infer<typeof getPetitionCountByDepartmentSchema>, res: Response)  => {
    try {
        const { id } = req.params;
        const results = await petitionServices.getPetitionCountByDepartment(id)
        res.json(results)
    } catch (error: any) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
}