import { DB } from './mongo-db'
import { JwtBlacklistModel } from '../types/models'

export const jwtBlacklistRepo = {

    async add(input: JwtBlacklistModel) {
        await DB.create('jwt-blacklist', input)
    },

    async get(jwt: string): Promise<JwtBlacklistModel | null> {
        return await DB.getOne('jwt-blacklist', {jwt: jwt}, {}) as JwtBlacklistModel | null
    },

    async gc(): Promise<number> {
        return DB.gc('jwt-blacklist', {exp: { $lt: Date.now() }})
    }

}


