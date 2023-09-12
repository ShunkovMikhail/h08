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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const inputValidation_1 = require("../../inputValidation");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const errorMapper_1 = require("../../utils/errorMapper");
const express_basic_auth_1 = __importDefault(require("express-basic-auth"));
const mongo_db_1 = require("../../repositories/mongo-db");
const users_service_1 = require("../../domain/users-service");
const users_query_repository_1 = require("../../repositories/query/users-query-repository");
exports.usersRouter = (0, express_1.Router)({});
exports.usersRouter.post('/', (0, express_basic_auth_1.default)({ users: mongo_db_1.admins }), inputValidation_1.userVdChain, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, express_validator_1.validationResult)(req);
    if (result.isEmpty()) {
        res.status(201).json(yield users_service_1.usersService.create(req));
    }
    else {
        res.status(400).json(yield (0, errorMapper_1.ErrorMapper)(result));
    }
}));
exports.usersRouter.get('/', (0, express_basic_auth_1.default)({ users: mongo_db_1.admins }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json(yield users_query_repository_1.usersQueryRepo.getAll(req));
}));
exports.usersRouter.delete('/:id', (0, express_basic_auth_1.default)({ users: mongo_db_1.admins }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendStatus(yield users_service_1.usersService.delete(req));
}));
