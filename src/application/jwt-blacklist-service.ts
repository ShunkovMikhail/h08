import { Request } from 'express'
import { jwtBlacklistRepo } from '../repositories/jwt-blacklist-repository'
import add from 'date-fns/add'
import { blacklistDuration } from '../settings'

export const jwtBlacklistService = {
    async add(req: Request) {
        await jwtBlacklistRepo.add({
            jwt: req.cookies.refreshToken,
            exp: add(new Date(), blacklistDuration).valueOf()
        })
        await jwtBlacklistRepo.gc()
    }
}