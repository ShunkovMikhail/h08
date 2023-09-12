import { unconfirmedUserDataModel, UserDataModel } from '../types/models'
import add from 'date-fns/add'
import isPast from 'date-fns/isPast'
import { usersRepo } from '../repositories/users-repository'

let data: Array<unconfirmedUserDataModel | null> = []

export const unconfirmedUsersService = {

    add(input: unconfirmedUserDataModel): boolean {
        //search for existing email +GC (returns: false if failed)
        for (let i = 0; i < data.length; i++) {
            if (data[i]) {
                if (isPast(new Date(data[i]!.meta.expirationDate))) {
                    data[i] = null
                } //else if (data[i]!.email === input.email || data[i]!.login === input.login) {
                    //return false
                    /*
                    //if the same email already exists in unconfirmed - all data will be overwritten and same cooldown applied.
                    //if (isPast(data[i]!.meta.cooldowns.codeResent)) {

                        const updateEntry = {
                            meta: {
                                ...input.meta,
                                cooldowns: {
                                    ...input.meta.cooldowns,
                                    codeResent: add(new Date(), {minutes: 1}).valueOf()
                                }
                            }
                        }

                        data[i] = Object.assign({}, input, updateEntry)
                        return true
                    //} else {
                    //    return false
                    //}
                    */
                //}
            }
        }
        data.push(input)
        return true
    },



    exists(loginOrEmail: string): boolean {
        //search for existing unconfirmed user +GC
        for (let i = 0; i < data.length; i++) {
            if (data[i]) {
                if (isPast(new Date(data[i]!.meta.expirationDate))) {
                    data[i] = null
                } else if (data[i]!.email === loginOrEmail || data[i]!.login === loginOrEmail) {
                    return true
                }
            }
        }
        return false
    },



    async confirm(code: string): Promise<boolean> {
        //search for existing code +GC, delete temp entry and create new entry in the database
        for (let i = 0; i < data.length; i++) {
            if (data[i]) {
                if (isPast(new Date(data[i]!.meta.expirationDate))) {
                    data[i] = null
                } else if (data[i]!.meta.code === code) {

                        const newEntry: UserDataModel = {
                            id: data[i]!.id,
                            login: data[i]!.login,
                            email: data[i]!.email,
                            createdAt: new Date().toISOString(),
                            meta: {
                                password: data[i]!.meta.password,
                            }
                        }

                        await usersRepo.create(newEntry)
                        data[i] = null
                        return true
                }
            }
        }
        return false
    },



    updateCode(email: string, code: string): boolean {
        //search for existing email +GC
        for (let i = 0; i < data.length; i++) {
            if (data[i]) {
                if (isPast(new Date(data[i]!.meta.expirationDate))) {
                    data[i] = null
                } else if (data[i]!.email === email) {
                    //if (isPast(data[i]!.meta.cooldowns.codeResent)) {

                        const updateEntry = {
                            meta: {
                                ...data[i]!.meta,
                                code: code,
                                cooldowns: {
                                    ...data[i]!.meta.cooldowns,
                                    codeResent: add(new Date(), {minutes: 1}).valueOf()
                                }
                            }
                        }

                        data[i] = Object.assign({}, data[i], updateEntry)
                        return true
                    //}
                }
            }
        }
        return false
    }

}