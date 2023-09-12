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
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsService = void 0;
const comments_repository_1 = require("../repositories/comments-repository");
exports.commentsService = {
    create(req, pId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newEntry = {
                id: comments_repository_1.commentsRepo.newID(),
                postId: pId,
                content: req.body.content,
                commentatorInfo: {
                    userId: req.user.id,
                    userLogin: req.user.login
                },
                createdAt: new Date().toISOString()
            };
            yield comments_repository_1.commentsRepo.create(Object.assign({}, newEntry));
            //exclude certain fields and return rest.
            const { postId } = newEntry, rest = __rest(newEntry, ["postId"]);
            return rest;
        });
    },
    update(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateEntry = {
                content: req.body.content
            };
            yield comments_repository_1.commentsRepo.update(req.params.id, updateEntry);
            return 204;
        });
    },
    delete(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return comments_repository_1.commentsRepo.delete(req.params.id);
        });
    }
};
