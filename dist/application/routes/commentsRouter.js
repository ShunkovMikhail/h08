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
exports.commentsRouter = void 0;
const inputValidation_1 = require("../../inputValidation");
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const errorMapper_1 = require("../../utils/errorMapper");
const auth_middlewares_1 = require("../../middlewares/auth-middlewares");
const comments_query_repository_1 = require("../../repositories/query/comments-query-repository");
const comments_service_1 = require("../../domain/comments-service");
exports.commentsRouter = (0, express_1.Router)({});
exports.commentsRouter.put('/:id', auth_middlewares_1.authMiddleware, inputValidation_1.CommentVdChain, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, express_validator_1.validationResult)(req);
    const comment = yield comments_query_repository_1.commentsQueryRepo.get(req.params.id);
    if (comment) {
        if (result.isEmpty()) {
            if (comment.commentatorInfo.userId === req.user.id) {
                res.status(204).json(yield comments_service_1.commentsService.update(req));
            }
            else {
                res.sendStatus(403);
            }
        }
        else {
            res.status(400).json(yield (0, errorMapper_1.ErrorMapper)(result));
        }
    }
    else {
        res.sendStatus(404);
    }
}));
exports.commentsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield comments_query_repository_1.commentsQueryRepo.exists(req.params.id)) {
        res.status(200).json(yield comments_query_repository_1.commentsQueryRepo.get(req.params.id));
    }
    else {
        res.sendStatus(404);
    }
}));
exports.commentsRouter.delete('/:id', auth_middlewares_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comments_query_repository_1.commentsQueryRepo.get(req.params.id);
    if (comment) {
        if (comment.commentatorInfo.userId === req.user.id) {
            res.sendStatus(yield comments_service_1.commentsService.delete(req));
        }
        else {
            res.sendStatus(403);
        }
    }
    else {
        res.sendStatus(404);
    }
}));
