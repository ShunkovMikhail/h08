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
exports.serverApp = exports.baseUrl = void 0;
const express_1 = __importDefault(require("express"));
const mongo_db_1 = require("./repositories/mongo-db");
const blogsRouter_1 = require("./application/routes/blogsRouter");
const postsRouter_1 = require("./application/routes/postsRouter");
const authRouter_1 = require("./application/routes/authRouter");
const usersRouter_1 = require("./application/routes/usersRouter");
const commentsRouter_1 = require("./application/routes/commentsRouter");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
exports.baseUrl = '';
const serverApp = (port) => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.get('/', (req, res) => {
        exports.baseUrl = req.protocol + '://' + req.hostname;
        res.sendStatus(204);
    });
    app.delete('/testing/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.sendStatus(yield mongo_db_1.DB.clear());
    }));
    app.use('/blogs', blogsRouter_1.blogsRouter);
    app.use('/posts', postsRouter_1.postsRouter);
    app.use('/auth', authRouter_1.authRouter);
    app.use('/users', usersRouter_1.usersRouter);
    app.use('/comments', commentsRouter_1.commentsRouter);
    app.listen(port, () => {
        console.log('Example app listening on port ' + port);
    });
};
exports.serverApp = serverApp;
