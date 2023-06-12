const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

module.exports = Object.freeze({
    getAll:async() =>prisma.registrations.findMany(),
    getById:async(CustomerID)=>{
        try {
            const registrations = prisma.registrations.findMany({
                where: {
                    CustomerID: +CustomerID
                }
            })
            return registrations;
        }
        catch(e){
            return e
        }
    },
    insert: async(data)=>{
        console.log(data)
        const {CustomerID,ProductCode,RegistrationDate} = data
        try{
            const registration = prisma.registrations.create({
                data:{
                    CustomerID,
                    ProductCode,
                    RegistrationDate
                }
            })
            return registration
        }
        catch(e){
            return e
        }
    },
    deleteById: async(CustomerID,ProductCode)=>{
        try {
            const registration = prisma.registrations.deleteMany({
                where: {
                    CustomerID: +CustomerID,
                    ProductCode: +ProductCode
                }
            })
            return registration;
        }
        catch(e){
            return e
        }
    }
})