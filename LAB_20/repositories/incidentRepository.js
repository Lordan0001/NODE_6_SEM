const { PrismaClient } = require('@prisma/client')

var moment = require('moment');
const prisma = new PrismaClient()

module.exports = Object.freeze({
    getAll:async() =>prisma.incidents.findMany(),
    getById:async(IncidentID)=>{
        try {
            const incident = prisma.incidents.findUnique({
                where: {
                    IncidentID: +IncidentID
                }
            })
            return incident;
        }
        catch(e){
            return e
        }
    },
    insert: async(data)=>{
        console.log(data)
        const {CustomerID,ProductCode,Title,Description} = data

// получаем название месяца, день месяца, год, время
        // создаем новый объект `Date`
        var today = new Date();

// получить сегодняшнюю дату в формате `MM/DD/YYYY`
        var now = today.toLocaleDateString('en-US');
        const dateNow = new Date(now)
        try{
            const incident = prisma.incidents.create({
                data:{
                    CustomerID,
                    ProductCode,
                    TechID :undefined,
                    DateOpened :dateNow,
                    DateClosed :undefined,
                    Title,
                    Description
                }
            })
            return incident
        }
        catch(e){
            return e
        }
    },
    update: async(updatedIncident)=>{
        const {IncidentID,CustomerID,ProductCode,TechID,DateOpened,DateClosed,Title,Description} = updatedIncident
        try {
            if (prisma.incidents.findUnique({
                where: {
                    IncidentID: +IncidentID
                }
            })
            ) {
                updatedIncident = prisma.incidents.update({
                    where: {
                        IncidentID: +IncidentID
                    },
                    data:{
                        CustomerID,
                        ProductCode,
                        TechID,
                        DateOpened,
                        DateClosed,
                        Title,
                        Description
                    }
                })
                return updatedIncident
            } else {
                throw new Error("Product not found")
            }
        }
        catch(e){
            return e
        }
    },
    deleteById: async(IncidentID)=>{
        try {
            const incident = prisma.incidents.delete({
                where: {
                    IncidentID: +IncidentID
                }
            })
            console.log(IncidentID)
            return incident;
        }
        catch(e){
            return e
        }
    }
})