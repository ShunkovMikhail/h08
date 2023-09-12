import { body } from 'express-validator'
import { DB } from './repositories/mongo-db'
import { usersQueryRepo } from './repositories/query/users-query-repository'
import { unconfirmedUsersService } from './domain/unconfirmed-users-service'
import { usersService } from './domain/users-service'

const urlPattern = new RegExp('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$')
const loginPattern = new RegExp('^[a-zA-Z0-9_-]*$')
const emailPattern = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')



const patternValidation = (value: string, regex: RegExp) => {
    if (!regex.test(value)) {
        throw new Error('Incorrect regex!')
    }
    return true
}



const blogExists = async (id: string) => {
    if (!await DB.exists('blogs', id)) {
        throw new Error('blogId does not exist!')
    }
    return true
}



const userExists = async (loginOrEmail: string) => {
    if (await usersQueryRepo.getDataByLoginOrEmail(loginOrEmail) || unconfirmedUsersService.exists(loginOrEmail)) {
        throw new Error('user already exists!')
    }
    return true
}



const verifyConfirmationCode = async (code: string) => {
    if (!await unconfirmedUsersService.confirm(code)) {
        throw new Error('incorrect code or expired!')
    }
    return true
}



const updateConfirmationCode = async (email: string) => {
    if (!await usersService.resendConfirmation(email)) {
        throw new Error('incorrect email or expired!')
    }
    return true
}



export const blogVdChain = [

    body('name', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({min: 1, max: 15}).withMessage('Too many characters! (maxLength: 15)'),

    body('description', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({min: 1, max: 500}).withMessage('Too many characters! (maxLength: 500)'),

    body('websiteUrl', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({min: 1, max: 100}).withMessage('Too many characters! (maxLength: 100)')
        .bail()
        .custom(websiteUrl => patternValidation(websiteUrl, urlPattern))

]



export const postVdChain = [

    body('blogId', 'Incorrect id!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({min: 1, max: 64})
        .bail()
        .custom(blogId => blogExists(blogId)),

    body('title', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({min: 1, max: 30}).withMessage('Too many characters! (maxLength: 30)'),

    body('shortDescription', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({min: 1, max: 100}).withMessage('Too many characters! (maxLength: 100)'),

    body('content', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({min: 1, max: 1000}).withMessage('Too many characters! (maxLength: 1000)')

]



export const blogPostVdChain = [

    body('title', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({min: 1, max: 30}).withMessage('Too many characters! (maxLength: 30)'),

    body('shortDescription', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({min: 1, max: 100}).withMessage('Too many characters! (maxLength: 100)'),

    body('content', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({min: 1, max: 1000}).withMessage('Too many characters! (maxLength: 1000)')

]



export const userVdChain = [

    body('login', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({min: 3, max: 10}).withMessage('Incorrect length! (3 - 10)')
        .bail()
        .custom(login => patternValidation(login, loginPattern)),

    body('password', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({min: 6, max: 20}).withMessage('Incorrect length! (6 - 20)'),

    body('email', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .custom(email => patternValidation(email, emailPattern))

]



export const registrationVdChain = [

    body('login', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({min: 3, max: 10}).withMessage('Incorrect length! (3 - 10)')
        .bail()
        .custom(login => patternValidation(login, loginPattern))
        .custom(login => userExists(login)),

    body('password', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({min: 6, max: 20}).withMessage('Incorrect length! (6 - 20)'),

    body('email', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .custom(email => patternValidation(email, emailPattern))
        .custom(email => userExists(email))

]



export const loginVdChain = [

    body('loginOrEmail', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({min: 1, max: 1000}).withMessage('Too many characters! (maxLength: 1000)'),

    body('password', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({min: 1, max: 1000}).withMessage('Too many characters! (maxLength: 1000)')

]



export const CommentVdChain = [

    body('content', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .isLength({min: 20, max: 300}).withMessage('Incorrect length! (20 - 300)')

]



export const emailVdChain = [

    body('email', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .custom(email => patternValidation(email, emailPattern))
        .custom(email => updateConfirmationCode(email))

]



export const confirmationCodeVdChain = [

    body('code', 'Incorrect format!')
        .trim()
        .notEmpty()
        .bail()
        .custom(code => verifyConfirmationCode(code))

]


