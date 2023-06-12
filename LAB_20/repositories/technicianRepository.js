const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

module.exports = Object.freeze({
    getAll:async() =>prisma.technicians.findMany(),
    getById:async(TechID)=>{
        try {
            const technician = prisma.technicians.findUnique({
                where: {
                    TechID: +TechID
                }
            })
            return technician;
        }
        catch(e){
            return e
        }
    },
    insert: async(data)=>{
        console.log(data)
        const {Name,Email,Phone} = data
        try{
            const technician = prisma.technicians.create({
                data:{
                    Name,
                    Email,
                    Phone
                }
            })
            return technician
        }
        catch(e){
            return e
        }
    },
    update: async(updatedTechnician)=>{
        const {TechID,Name,Email,Phone} = updatedTechnician
        try {
            if (prisma.technicians.findUnique({
                where: {
                    TechID: +TechID
                }
            })
            ) {
                updatedTechnician = prisma.technicians.update({
                    where: {
                        TechID: +TechID
                    },
                    data:{
                        Name,
                        Email,
                        Phone
                    }
                })
                return updatedTechnician
            } else {
                throw new Error("Technician not found")
            }
        }
        catch(e){
            return e
        }
    },
    deleteById: async(TechID)=>{
        try {
            const technician = prisma.technicians.delete({
                where: {
                    TechID: +TechID
                }
            })
            return technician;
        }
        catch(e){
            return e
        }
    }
})