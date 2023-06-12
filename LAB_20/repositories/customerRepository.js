const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

module.exports = Object.freeze({
    getAll:async() =>prisma.customers.findMany(),
    getById:async(CustomerID)=>{
        try {
            const customer = prisma.customers.findUnique({
                where: {
                    CustomerID: +CustomerID
                }
            })
            return customer;
        }
        catch(e){
            return e
        }
    },
    insert: async(data)=>{
        console.log(data)
        const {Name,Address,City,Phone,Email} = data
        try{
             const customer = prisma.customers.create({
                data:{
                    Name,
                    Address,
                    City,
                    Phone,
                    Email
                }
            })
            return customer
        }
        catch(e){
            return e
        }
    },
    update: async(updatedCustomer)=>{
        const {CustomerID,Name,Address,City,Phone,Email} = updatedCustomer
        try {
            if (prisma.customers.findUnique({
                where: {
                    CustomerID: +CustomerID
                }
            })
            ) {
                updatedCustomer = prisma.customers.update({
                    where: {
                        CustomerID: +CustomerID
                    },
                    data:{
                        Name,
                        Address,
                        City,
                        Phone,
                        Email
                    }
                })
                return updatedCustomer
            } else {
                throw new Error("Customer not found")
            }
        }
        catch(e){
            return e
        }
    },
    deleteById: async(CustomerID)=>{
        try {
            const customer = prisma.customers.delete({
                where: {
                    CustomerID: +CustomerID
                }
            })
            return customer;
        }
        catch(e){
            return e
        }
    }
})