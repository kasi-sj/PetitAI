import { prisma } from '../config/db';
import { Request, Response } from 'express';

export const getAllUsers = async (req: Request, res: Response) => {
    const users = await prisma.user.findMany()
    res.json(users)
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = await prisma.user.findUnique({
        where: {
            id: id,
        },
        include: {
            adminOf : true,
            _count: {
                select: {
                    petitions: true
                }
            }
        },
        omit: {
            hashedPassword: true
        }
    })
    res.json(user)
};

export const createUser = async (req: Request, res: Response) => {
    const { name, email } = req.body
    const user = await prisma.user.create({
        data: {
            name,
            email
        }
    })
    res.json(user)
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = await prisma.user.update({
        where: {
            id: id
        },
        data: {
            ...req.body
        }
    })
    res.json(user)
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = await prisma.user.delete({
        where: {
            id: id
        }
    })
    res.json(user)
};