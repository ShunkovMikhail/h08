import { DB } from './mongo-db'
import { UserInputModel, UserViewModel } from '../types/models'
import { generateID } from '../utils/generateID'

export const usersRepo = {

    async create(input: UserViewModel) {
        await DB.create('users', input)
    },

    async update(id: string, input: UserInputModel) {
        await DB.update('users', id, input)
    },

    async delete(id: string): Promise<number> {
        return DB.delete('users', id)
    },

    newID(): string {
        return generateID.uu()
    }

}


