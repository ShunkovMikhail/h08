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
exports.unconfirmedUsersService = void 0;
const add_1 = __importDefault(require("date-fns/add"));
const isPast_1 = __importDefault(require("date-fns/isPast"));
const users_repository_1 = require("../repositories/users-repository");
let data = [];
exports.unconfirmedUsersService = {
    add(input) {
        //search for existing email +GC (returns: false if failed)
        for (let i = 0; i < data.length; i++) {
            if (data[i]) {
                if ((0, isPast_1.default)(new Date(data[i].meta.expirationDate))) {
                    data[i] = null;
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
        data.push(input);
        return true;
    },
    exists(loginOrEmail) {
        //search for existing unconfirmed user +GC
        for (let i = 0; i < data.length; i++) {
            if (data[i]) {
                if ((0, isPast_1.default)(new Date(data[i].meta.expirationDate))) {
                    data[i] = null;
                }
                else if (data[i].email === loginOrEmail || data[i].login === loginOrEmail) {
                    return true;
                }
            }
        }
        return false;
    },
    confirm(code) {
        return __awaiter(this, void 0, void 0, function* () {
            //search for existing code +GC, delete temp entry and create new entry in the database
            for (let i = 0; i < data.length; i++) {
                if (data[i]) {
                    if ((0, isPast_1.default)(new Date(data[i].meta.expirationDate))) {
                        data[i] = null;
                    }
                    else if (data[i].meta.code === code) {
                        const newEntry = {
                            id: data[i].id,
                            login: data[i].login,
                            email: data[i].email,
                            createdAt: new Date().toISOString(),
                            meta: {
                                password: data[i].meta.password,
                            }
                        };
                        yield users_repository_1.usersRepo.create(newEntry);
                        data[i] = null;
                        return true;
                    }
                }
            }
            return false;
        });
    },
    updateCode(email, code) {
        //search for existing email +GC
        for (let i = 0; i < data.length; i++) {
            if (data[i]) {
                if ((0, isPast_1.default)(new Date(data[i].meta.expirationDate))) {
                    data[i] = null;
                }
                else if (data[i].email === email) {
                    //if (isPast(data[i]!.meta.cooldowns.codeResent)) {
                    const updateEntry = {
                        meta: Object.assign(Object.assign({}, data[i].meta), { code: code, cooldowns: Object.assign(Object.assign({}, data[i].meta.cooldowns), { codeResent: (0, add_1.default)(new Date(), { minutes: 1 }).valueOf() }) })
                    };
                    data[i] = Object.assign({}, data[i], updateEntry);
                    return true;
                    //}
                }
            }
        }
        return false;
    }
};
