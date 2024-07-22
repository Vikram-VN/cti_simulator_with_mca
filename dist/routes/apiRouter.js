"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
var express_1 = __importDefault(require("express"));
var globals_1 = require("./globals");
exports.apiRouter = express_1.default.Router();
exports.apiRouter.get('/test', function (req, res, next) {
    res.json({
        message: 'hi'
    });
});
exports.apiRouter.get('/agent-status', function (req, res, next) {
    var status = Array.from(globals_1.agentStatus, function (_a) {
        var agentId = _a[0], isAvailable = _a[1];
        return ({ agentId: agentId, isAvailable: isAvailable });
    });
    res.json(status);
});
