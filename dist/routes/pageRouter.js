"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageRouter = void 0;
var express_1 = __importDefault(require("express"));
exports.pageRouter = express_1.default.Router();
exports.pageRouter.get('/client-app', function (req, res, next) {
    res.render('client-app');
});
exports.pageRouter.get('/cti-admin', function (req, res, next) {
    res.render('cti-admin');
});
