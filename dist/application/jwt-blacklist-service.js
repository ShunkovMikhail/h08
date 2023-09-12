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
exports.jwtBlacklistService = void 0;
const jwt_blacklist_repository_1 = require("../repositories/jwt-blacklist-repository");
const add_1 = __importDefault(require("date-fns/add"));
const settings_1 = require("../settings");
exports.jwtBlacklistService = {
    add(req) {
        return __awaiter(this, void 0, void 0, function* () {
            yield jwt_blacklist_repository_1.jwtBlacklistRepo.add({
                jwt: req.cookies.refreshToken,
                exp: (0, add_1.default)(new Date(), settings_1.blacklistDuration).valueOf()
            });
            if (req.headers.authorization) {
                yield jwt_blacklist_repository_1.jwtBlacklistRepo.add({
                    jwt: req.headers.authorization.split(' ')[1],
                    exp: (0, add_1.default)(new Date(), settings_1.blacklistDuration).valueOf()
                });
            }
            yield jwt_blacklist_repository_1.jwtBlacklistRepo.gc();
        });
    }
};
