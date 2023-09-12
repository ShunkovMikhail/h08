import {
    LoginInputModel,
    TypeOfRequestBody,
    TypeOfRequestP,
    unconfirmedUserDataModel,
    UserDataModel,
    UserInputModel,
    UserViewModel
} from '../types/models'
import { usersRepo } from '../repositories/users-repository'
import bcrypt from 'bcrypt'
import { usersQueryRepo } from '../repositories/query/users-query-repository'
import { emailManager } from '../managers/email-manager'
import add from 'date-fns/add'
import { generateID } from '../utils/generateID'
import { unconfirmedUsersService } from './unconfirmed-users-service'

export const usersService = {

    async create(req: TypeOfRequestBody<UserInputModel>): Promise<UserViewModel> {

        const newEntry: UserDataModel = {
            id: usersRepo.newID(),
            login: req.body.login,
            email: req.body.email,
            createdAt: new Date().toISOString(),
            meta: {
                password: await bcrypt.hash(req.body.password, 8)
            }
        }

        await usersRepo.create({ ...newEntry })
        //exclude certain fields and return rest.
        const { meta, ...rest } = newEntry
        return rest as UserViewModel
    },



    async register(req: TypeOfRequestBody<UserInputModel>): Promise<number> {

        const newEntry: unconfirmedUserDataModel = {
            id: usersRepo.newID(),
            login: req.body.login,
            email: req.body.email,
            meta: {
                password: await bcrypt.hash(req.body.password, 8),
                code: generateID.pretty(7),
                expirationDate: add(new Date(), {minutes: 10}).toISOString(),
                cooldowns: {
                    codeResent: add(new Date(), {minutes: 1}).valueOf()
                }
            }
        }

        if (unconfirmedUsersService.add(newEntry)) {
            await emailManager.accountConfirmation(newEntry.email, newEntry.meta.code)
            return 204
        } else {
            return 400
        }
    },



    async resendConfirmation(email: string): Promise<boolean> {

        const code = generateID.pretty(7)

        if (unconfirmedUsersService.updateCode(email, code)) {
            await emailManager.accountConfirmation(email, code)
            return true
        } else {
            return false
        }
    },



    async delete(req: TypeOfRequestP<{ id: string }>): Promise<number> {
        return usersRepo.delete(req.params.id)
    },



    async authenticate(req: TypeOfRequestBody<LoginInputModel>): Promise<UserDataModel | null> {
        const user = await usersQueryRepo.getDataByLoginOrEmail(req.body.loginOrEmail)
        if (user) {
            if (await bcrypt.compare(req.body.password, user.meta.password)) {
                return user
            }
        }
        return null
    }

}