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
exports.usersQueryRepo = void 0;
const mongo_db_1 = require("../mongo-db");
const setDefault_1 = require("../../utils/setDefault");
exports.usersQueryRepo = {
    getAll(req) {
        return __awaiter(this, void 0, void 0, function* () {
            let loginQuery = {};
            let emailQuery = {};
            let query = {};
            if (req.query.searchLoginTerm !== undefined) {
                loginQuery = { 'login': { '$regex': req.query.searchLoginTerm, '$options': 'i' } };
            }
            if (req.query.searchEmailTerm !== undefined) {
                emailQuery = { 'email': { '$regex': req.query.searchEmailTerm, '$options': 'i' } };
            }
            if (req.query.searchLoginTerm !== undefined && req.query.searchEmailTerm !== undefined) {
                query = { $or: [Object.assign({}, loginQuery), Object.assign({}, emailQuery)] };
            }
            else {
                query = Object.assign(Object.assign({}, loginQuery), emailQuery);
            }
            const sortBy = (0, setDefault_1.setDefault)(req.query.sortBy, 'createdAt');
            const sortDirection = (0, setDefault_1.setDefault)(req.query.sortDirection, 'desc');
            const pageNumber = parseInt((0, setDefault_1.setDefault)(req.query.pageNumber, 1), 10);
            const pageSize = parseInt((0, setDefault_1.setDefault)(req.query.pageSize, 10), 10);
            const resCount = yield mongo_db_1.DB.countResults('users', query);
            const pCount = Math.ceil(resCount / pageSize);
            const S = (pageNumber - 1) * pageSize;
            const L = pageSize;
            const page = {
                pagesCount: pCount,
                page: pageNumber,
                pageSize: pageSize,
                totalCount: resCount,
                items: yield mongo_db_1.DB.getAll('users', query, { meta: 0 }, { [sortBy]: sortDirection }, S, L)
            };
            return page;
        });
    },
    getDataById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mongo_db_1.DB.getOne('users', { id: id }, {});
        });
    },
    getDataByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mongo_db_1.DB.getOne('users', { $or: [{ login: loginOrEmail }, { email: loginOrEmail }] }, {});
        });
    },
    exists(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return mongo_db_1.DB.exists('users', id);
        });
    }
};
