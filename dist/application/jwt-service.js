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
exports.jwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const settings_1 = require("../settings");
const jwt_blacklist_repository_1 = require("../repositories/jwt-blacklist-repository");
exports.jwtService = {
    createToken(user, duration) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({ userId: user.id }, settings_1.jwtSecret, { expiresIn: duration });
        });
    },
    verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield jwt_blacklist_repository_1.jwtBlacklistRepo.get(token)) {
                try {
                    const result = jsonwebtoken_1.default.verify(token, settings_1.jwtSecret);
                    return result.userId;
                }
                catch (e) {
                    return null;
                }
            }
            else {
                return null;
            }
        });
    }
};
