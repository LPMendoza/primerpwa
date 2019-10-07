"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = __importDefault(require("mysql"));
var keys_1 = __importDefault(require("./keys"));
var pool = mysql_1.default.createPool(keys_1.default.database);
exports.default = pool;
