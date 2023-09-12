"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshMiddleware = exports.authMiddleware = void 0;
const jwt_service_1 = require("../application/jwt-service");
const users_query_repository_1 = require("../repositories/query/users-query-repository");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization) {
        const accessToken = req.headers.authorization.split(' ')[1];
        const userId = yield jwt_service_1.jwtService.verifyToken(accessToken);
        if (userId) {
            req.user = yield users_query_repository_1.usersQueryRepo.getDataById(userId);
            next();
        }
        else {
            res.sendStatus(401);
        }
    }
    else {
        res.sendStatus(401);
    }
});
exports.authMiddleware = authMiddleware;
const refreshMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.refreshToken) {
        const refreshToken = req.cookies.refreshToken;
        const userId = yield jwt_service_1.jwtService.verifyToken(refreshToken);
        if (userId) {
            req.user = yield users_query_repository_1.usersQueryRepo.getDataById(userId);
            next();
        }
        else {
            res.sendStatus(401);
        }
    }
    else {
        res.sendStatus(401);
    }
});
exports.refreshMiddleware = refreshMiddleware;
