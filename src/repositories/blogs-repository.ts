import { DB } from './mongo-db'
import { BlogInputModel, BlogViewModel } from '../types/models'
import { generateID } from '../utils/generateID'

export const blogsRepo = {

    async create(input: BlogViewModel) {
        await DB.create('blogs', input)
    },

    async update(id: string, input: BlogInputModel) {
        await DB.update('blogs', id, input)
    },

    async delete(id: string): Promise<number> {
        return DB.delete('blogs', id)
    },

    newID(): string {
        return generateID.pretty(16)
    }

}


