import { StatusEnum } from "@prisma/client"
import { prisma } from "../config/db"

export const createStatusUpdate = async (petitionId :string , status :string , description :string ) => {
    status = status.toUpperCase() as StatusEnum
    const statusUpdate = await prisma.statusUpdate.create({
        data : {
            status : status as StatusEnum,
            petitionId : petitionId,
            description : description
        }
    })
    return statusUpdate
}