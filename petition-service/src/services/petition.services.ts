import { PriorityEnum } from '@prisma/client';
import { prisma } from '../config/db';
import { Request, Response } from 'express';
import { addPetitionEmbedding, deletePetitionEmbedding, getMostSimilarEmbeddingResult, updatePetitionEmbedding, getMostSimilarEmbeddings } from './embedding.services';
import { title } from 'process';
import { z } from 'zod';
import { getPetitionSchema, updatePetitionSchema } from '../validators/petition';
import { resourceLimits } from 'worker_threads';

// Get all petitions
export const getAllPetitions = async (req: Request, res: Response) => {
    const petitions = await prisma.petition.findMany({
        include: {
            statusUpdates: true,
            department: true
        }
    });
    res.json(petitions);
};

// Get a single petition by ID
export const getPetitionById = async (req: z.infer<typeof getPetitionSchema>, res: Response) => {
    const { id } = req.params;
    const { includeUser } = req.query
    const petition = await prisma.petition.findUnique({
        where: { id },
        include: {
            statusUpdates: true,
            department: true,
            fromUser: includeUser ? {
                select: {
                    createdAt: false,
                    hashedPassword: false,
                    googleId: false,
                    updatedAt: false
                }
            } : false,
            organizationUserAssignments: {
                where: {
                    isActive: true
                },
                include: {
                    organizationUser: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }
        }
    });
    res.json(petition);
};

// Create a new petition
export const createPetition = async (req: Request, res: Response) => {
    const { id, fromUserId, organizationId, departmentId, subject, body, tag, priority, attachments } = req.body;
    const createObject: any = {
        fromUserId,
        organizationId,
        departmentId,
        subject,
        body,
        tag,
        priority: priority as PriorityEnum,
        attachments,
    }
    if (id) {
        createObject.id = id
    }
    const petition = await prisma.petition.create({
        data: createObject,

        include: {
            statusUpdates: true,
            department: true
        }

    });
    const text = subject + " " + body;
    // const mostSimilarResult = await getMostSimilarEmbeddingResult(title+body , tag)
    const petitionEmbeddingResponse = await addPetitionEmbedding({
        _id: petition.id,
        text: text,
        tag: tag
    })
    res.json({
        ...petition,
        // mostSimilarResult: mostSimilarResult,
        petitionEmbedding: petitionEmbeddingResponse,
    });
};

// Update a petition
export const updatePetition = async (req: z.infer<typeof updatePetitionSchema>, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const { departmentId, priority, tag } = data
    const updateEmbeddingResponse = await updatePetitionEmbedding(id, tag);
    const updatePetitionResponse = await prisma.petition.update({
        where: { id },
        data: {
            priority,
            tag,
            departmentId
        }, include: {
            statusUpdates: true,
            department: true
        }
    })
    res.json({
        updateEmbeddingResponse,
        updatePetitionResponse
    });
};



// Delete a petition
export const deletePetition = async (req: Request, res: Response) => {
    const { id } = req.params;
    const petition = await prisma.petition.delete({
        where: { id },

        include: {
            statusUpdates: true,
            department: true
        }

    });
    const petitionEmbeddingDeleted = await deletePetitionEmbedding(id);
    console.log("petitionDeleted", petition);
    console.log("petitionEmbeddingDeleted", petitionEmbeddingDeleted);
    res.json({
        ...petition,
        petitionEmbeddingDeleted
    });
};

export const getMostSimilarPetition = async (req: Request, res: Response) => {
    const { text, tag } = req.body;
    const mostSimilarResult: any = await getMostSimilarEmbeddingResult(text, tag);
    if (mostSimilarResult && mostSimilarResult.length > 0) {
        const petitionId = mostSimilarResult[0].petitionId;
        if (petitionId) {
            mostSimilarResult[0].petition = await prisma.petition.findUnique({ where: { id: petitionId } })
        }
    }
    res.json(mostSimilarResult);
}

export const getUserPetitions = async (userId: string, Organization: string | undefined, limit: string, page: string) => {
    try {
        let where: {
            fromUserId: string
            organization?: {
                name: string
            }
        };
        if (Organization) {
            where = {
                fromUserId: userId,
                organization: {
                    name: Organization
                }
            }
        } else {
            where = {
                fromUserId: userId
            }
        }
        const petitions = await prisma.petition.findMany({
            where: {
                ...where,
                
                organization: {
                    name: Organization
                }
            },
            include: {
                statusUpdates: true,
                department: true,
                fromUser: {
                    omit: {
                        createdAt: true,
                        hashedPassword: true,
                        googleId: true,
                        updatedAt: true
                    }
                }
            },
            orderBy: {
                priority: 'asc'
            },
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit)
        })
        const petitionsCount = await prisma.petition.count({
            where: where
        })
        const totalPages = Math.ceil(petitionsCount / parseInt(limit))
        return {
            petitions,
            totalPages
        }
    } catch (error) {
        throw error
    }
}

export const getOrganizationUserPetitions = async (organizationUserId: string, isPending: string | undefined, limit: string, page: string) => {
    try {
        let where = {}
        if (isPending) {
            where = {
                organizationUserId: organizationUserId,
                isActive: true,
            }
        } else {
            where = {
                organizationUserId: organizationUserId,
            }
        }
        const petitionsAssignments = await prisma.petitionOrganizationUserAssignment.findMany({
            where: where,
            include: {
                petition: {
                    include: {
                        statusUpdates: true,
                        department: true,
                        fromUser: {
                            omit: {
                                createdAt: true,
                                hashedPassword: true,
                                googleId: true,
                                updatedAt: true
                            }
                        }
                    }
                }
            },
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            orderBy: {
                petition:{
                    priority: 'asc'
                },
                createdAt: 'desc'
            }
        });
        const petitionsCount = await prisma.petitionOrganizationUserAssignment.count({
            where: where
        });
        const totalPages = Math.ceil(petitionsCount / parseInt(limit));
        return {
            petitionsAssignments,
            totalPages
        };
    } catch (e) {
        console.log(e)
        return {}
    }
}

export const getAdminPetitions = async (adminUserId: string, isPending: string | undefined, limit: string, page: string) => {
    try {
        const organization = await prisma.organization.findFirst({
            where: {
                adminId: adminUserId
            }
        })
        if (!organization) {
            throw new Error("organization not found");
        }
        let where = {}
        if (isPending) {
            where = {
                organizationUser: {
                    organizationId: organization.id
                }, isActive: true,
            }
        } else {
            where = {
                organizationUser: {
                    organizationId: organization.id
                }
            }
        }
        const petitionsAssignments = await prisma.petitionOrganizationUserAssignment.findMany({
            where: where,
            include: {
                petition: {
                    include: {
                        statusUpdates: true,
                        department: true,
                        fromUser: {
                            omit: {
                                createdAt: true,
                                hashedPassword: true,
                                googleId: true,
                                updatedAt: true
                            }
                        }
                    }
                }
            },
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            orderBy: {
                createdAt: 'desc'
            }
        });
        const petitionsCount = await prisma.petitionOrganizationUserAssignment.count({
            where: where
        });
        const totalPages = Math.ceil(petitionsCount / parseInt(limit));
        return {
            petitionsAssignments,
            totalPages
        };
    } catch (e) {
        console.log(e)
        return {}
    }
}

export const getMostSimilarPetitions = async (petitionId: string) => {
    const petition = await prisma.petition.findUnique({ where: { id: petitionId } });
    if (!petition) {
        throw new Error("Petition not found");
    }
    const body = petition.body;
    const subject = petition.subject;
    const text = subject + " " + body;
    const tag = petition.tag;
    let result = await getMostSimilarEmbeddings(text, tag);
    result = result.filter((r) => r.petitionId !== petitionId);
    const petitions = await prisma.petition.findMany({
        where: {
            id: {
                in: result.map((r) => r.petitionId),
            },
        },
        include: {
            statusUpdates: true,
            department: true,
            organizationUserAssignments: {
                where: {
                    isActive: true
                },
                include: {
                    organizationUser: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            },
            fromUser: {
                omit: {
                    createdAt: true,
                    hashedPassword: true,
                    googleId: true,
                    updatedAt: true
                }
            }
        }
    });
    const updatedPetitions = petitions.map((p) => {
        const similarity = result.find((r) => r.petitionId === p.id)?.similarity;
        return { ...p, similarity };
    });
    return updatedPetitions;
}


export const getPetitionCount = async (organizationId: string, departmentId: string | undefined, organizationUserId: string | undefined, from: string, to: string) => {
    try {
        let where: any = {
            organizationId: organizationId,
        }
        if (departmentId) {
            where.departmentId = departmentId
        }
        if (organizationUserId) {
            where.organizationUserAssignments = {
                some: {
                    organizationUserId: organizationUserId
                }
            }
        }
        if (from && to) {
            where.createdAt = {
                gte: new Date(from),
                lte: new Date(to)
            }
        }
        const petitionsData = await prisma.petition.groupBy({
            by: ["createdAt", "priority"],
            where: where,
            _count: {
                _all: true, // Total petitions count
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        let finalResult: { [key: string]: { High: number, Medium: number, Low: number, total: number, date: Date } } = {}
        petitionsData.map((item) => {
            const totalPetitions = item._count._all
            const date = item.createdAt.toDateString()
            const priority = item.priority
            if (!finalResult[date]) {
                finalResult[date] = {
                    High: 0,
                    Medium: 0,
                    Low: 0,
                    total: 0,
                    date: item.createdAt
                };
            }
            finalResult[date].total += totalPetitions;
            if (priority == "HIGH")
                finalResult[date].High += totalPetitions;
            else if (priority == "MEDIUM")
                finalResult[date].Medium += totalPetitions;
            else if (priority == "LOW")
                finalResult[date].Low += totalPetitions;
        })
        const finalResultList = Object.keys(finalResult).map((key) => finalResult[key]);
        return finalResultList
    } catch (error) {
        throw error
    }
}

export const getPetitionCountByDepartment = async (organizationId: string) => {
    try {
        const petitionsData = await prisma.petition.groupBy({
            by: ["departmentId"],
            where: {
                organizationId: organizationId
            },
            _count: {
                _all: true, // Total petitions count
            },
            orderBy: {
                departmentId: "asc",
            },
        });
        const departments = await prisma.department.findMany({
            where: {
                organizationId: organizationId
            }
        })
        const finalResult: { [key: string]: { name: string, count: number } } = {}
        petitionsData.map((item) => {
            const departmentId = item.departmentId
            const count = item._count._all
            const department = departments.find((d) => d.id === departmentId)
            if (department) {
                finalResult[department.name] = {
                    name: department.name,
                    count: count
                }
            }
        })
        const finalResultList = Object.keys(finalResult).map((key) => finalResult[key]);
        return finalResultList
    } catch (error) {
        throw error
    }
}