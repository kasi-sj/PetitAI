import { prisma } from "../config/db"
import { Request, Response } from 'express';

export const assignPetitionToOrgUser = async (petitionId: string, orgUserId: string|undefined, res: Response) => {
    try {
        const petition = await prisma.petition.findUnique({
            where: { id: petitionId }
        });
        if (!petition) {
            res.status(404).json({ message: "Petition not found" });
            return
        }
        const alreadyAssigned = await prisma.petitionOrganizationUserAssignment.findFirst({
            where: {
                petitionId,
                isActive: true
            }
        });
        if (alreadyAssigned) {
            await prisma.petitionOrganizationUserAssignment.update({
                where: {
                    id: alreadyAssigned.id
                },
                data: {
                    isActive: false
                }
            });
        }
        const organizationUser = await prisma.organizationUser.findUnique({
            where: { id: orgUserId }
        });
        if (!organizationUser || !orgUserId) {
            res.status(404).json({ message: "Organization User not found" });
            return
        }
        const petitionOrganizationUserAssignment = await prisma.petitionOrganizationUserAssignment.create({
            data: {
                petitionId,
                organizationUserId: orgUserId
            }
        });
        res.json(petitionOrganizationUserAssignment);
    } catch (error) {
        res.status(500).json({ message: "Error assigning petition to organization user", error });
    }
}