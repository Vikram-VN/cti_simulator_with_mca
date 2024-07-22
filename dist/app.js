"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var https_1 = __importDefault(require("https"));
var debug_1 = __importDefault(require("./config/debug"));
var pageRouter_1 = require("./routes/pageRouter");
var apiRouter_1 = require("./routes/apiRouter");
var socket_io_1 = require("socket.io");
var fs = require('fs');
var app = (0, express_1.default)();
var globals_1 = require("./routes/globals");
var port = debug_1.default.PORT;
var options = {
    key: fs.readFileSync('security/domain.key'),
    cert: fs.readFileSync('security/domain.crt'),
    requestCert: false,
    rejectUnauthorized: false
};
var PORT = port || 3000;
var server = https_1.default.createServer(options, app).listen(PORT, function () {
    console.log('Running at port', PORT);
});
var io = new socket_io_1.Server(server);
io.on('connection', function (socket) {
    console.log('endpoint connected');
    socket.on('disconnect', function () {
        console.log('endpoint disconnected');
    });
    socket.on('ctiEvent', function (payload) {
        console.log('payload', payload);
        if (payload.target == 'admin') {
            switch (payload.command) {
                case 'login':
                    globals_1.agentStatus.set(payload.agentId, true);
                    break;
                case 'logout':
                    globals_1.agentStatus.delete(payload.agentId);
                    break;
                case 'availability':
                    globals_1.agentStatus.set(payload.agentId, payload.availability);
                    break;
            }
        }
        io.emit('ctiEvent', payload);
    });
});
var publicDirectoryPath = path_1.default.join(__dirname, "./public");
app.use(express_1.default.static(publicDirectoryPath));
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/cti-simulator/pages', pageRouter_1.pageRouter);
app.use('/cti-simulator/apis', apiRouter_1.apiRouter);
app.get('/', function (req, res, next) { return res.render('index'); });
app.use(function (req, res, next) {
    if (req.protocol === 'http') {
        return res.redirect(301, "https://".concat(req.headers.host).concat(req.url));
    }
    next();
});
// server.listen(port, () => {
//   console.log(`SERVER RUNNING ON ${port}`);
// });
