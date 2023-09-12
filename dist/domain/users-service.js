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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = void 0;
const users_repository_1 = require("../repositories/users-repository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_query_repository_1 = require("../repositories/query/users-query-repository");
const email_manager_1 = require("../managers/email-manager");
const add_1 = __importDefault(require("date-fns/add"));
const generateID_1 = require("../utils/generateID");
const unconfirmed_users_service_1 = require("./unconfirmed-users-service");
exports.usersService = {
    create(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const newEntry = {
                id: users_repository_1.usersRepo.newID(),
                login: req.body.login,
                email: req.body.email,
                createdAt: new Date().toISOString(),
                meta: {
                    password: yield bcrypt_1.default.hash(req.body.password, 8)
                }
            };
            yield users_repository_1.usersRepo.create(Object.assign({}, newEntry));
            //exclude certain fields and return rest.
            const { meta } = newEntry, rest = __rest(newEntry, ["meta"]);
            return rest;
        });
    },
    register(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const newEntry = {
                id: users_repository_1.usersRepo.newID(),
                login: req.body.login,
                email: req.body.email,
                meta: {
                    password: yield bcrypt_1.default.hash(req.body.password, 8),
                    code: generateID_1.generateID.pretty(7),
                    expirationDate: (0, add_1.default)(new Date(), { minutes: 10 }).toISOString(),
                    cooldowns: {
                        codeResent: (0, add_1.default)(new Date(), { minutes: 1 }).valueOf()
                    }
                }
            };
            if (unconfirmed_users_service_1.unconfirmedUsersService.add(newEntry)) {
                yield email_manager_1.emailManager.accountConfirmation(newEntry.email, newEntry.meta.code);
                return 204;
            }
            else {
                return 400;
            }
        });
    },
    resendConfirmation(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = generateID_1.generateID.pretty(7);
            if (unconfirmed_users_service_1.unconfirmedUsersService.updateCode(email, code)) {
                yield email_manager_1.emailManager.accountConfirmation(email, code);
                return true;
            }
            else {
                return false;
            }
        });
    },
    delete(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return users_repository_1.usersRepo.delete(req.params.id);
        });
    },
    authenticate(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_query_repository_1.usersQueryRepo.getDataByLoginOrEmail(req.body.loginOrEmail);
            if (user) {
                if (yield bcrypt_1.default.compare(req.body.password, user.meta.password)) {
                    return user;
                }
            }
            return null;
        });
    }
};
