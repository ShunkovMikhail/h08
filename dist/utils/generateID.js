"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateID = void 0;
const uuid_1 = require("uuid");
const setDefault_1 = require("./setDefault");
exports.generateID = {
    uu() {
        return (0, uuid_1.v4)();
    },
    pretty(length) {
        (0, setDefault_1.setDefault)(length, 33);
        const id = (0, uuid_1.v4)();
        return id.replace(/-/g, '').slice(0, length);
    }
};
