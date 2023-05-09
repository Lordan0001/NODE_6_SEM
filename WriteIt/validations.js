import {body} from 'express-validator'

export const loginValidation =[
    body('email',"Wrong email format").isEmail(),
    body('password','Password is less than 5 characters').isLength({min: 5})
]

export const registerValidation =[
    body('email',"Wrong email format").isEmail(),
    body('password','Password is less than 5 characters').isLength({min: 5}),
    body('fullName',"Enter your name").isLength({min: 3}),
    body('avatarUrl','Bad url to image').optional().isURL(),
]

export const postCreateValidation =[
    body('title',"Enter post title").isLength({min: 3}).isString(),
    body('text','Fill the post column').isLength({min: 3}).isString(),
    body('tags',"Wrong tag format").optional().isString(),
    body('imageUrl','Bad url to image').optional().isString(),
]