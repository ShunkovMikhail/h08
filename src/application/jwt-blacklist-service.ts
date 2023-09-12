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
        if (req.headers.authorization) {
            await jwtBlacklistRepo.add({
                jwt: req.headers.authorization.split(' ')[1],
                exp: add(new Date(), blacklistDuration).valueOf()
            })
        }
        await jwtBlacklistRepo.gc()
    }
}