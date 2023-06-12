const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

module.exports = Object.freeze({
    getAll:async() =>prisma.products.findMany(),
    getById:async(ProductCode)=>{
        try {
            const product = prisma.products.findUnique({
                where: {
                    ProductCode: +ProductCode
                }
            })
            console.log(product)
            return product;
        }
        catch(e){
            return e
        }
    },
    insert: async(data)=>{
        console.log(data)
        const {Name,Version,ReleaseDate} = data
        try{
            const product = prisma.products.create({
                data:{
                    Name,
                    Version,
                    ReleaseDate
                }
            })
            return product
        }
        catch(e){
            return e
        }
    },
    update: async(updatedProduct)=>{
        console.log(updatedProduct)
        const {ProductCode,Name,Version,ReleaseDate} = updatedProduct
        console.log(ReleaseDate)
        try {
            if (prisma.products.findUnique({
                where: {
                    ProductCode: +ProductCode
                }
            })
            ) {
                updatedProduct = prisma.products.update({
                    where: {
                        ProductCode: +ProductCode
                    },
                    data:{
                        Name,
                        Version,
                        ReleaseDate:ReleaseDate
                    }
                })
                return updatedProduct
            } else {
                throw new Error("Product not found")
            }
        }
        catch(e){
            return e
        }
    },
    deleteById: async(ProductCode)=>{
        try {
            const product = prisma.products.delete({
                where: {
                    ProductCode: +ProductCode
                }
            })
            return product;
        }
        catch(e){
            return e
        }
    }
})