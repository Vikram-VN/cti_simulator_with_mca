import express, { Application, Request, Response } from "express";
import path from "path";
import http from "http"
import debug from "./config/debug";
import { pageRouter } from './routes/pageRouter';
import { apiRouter } from './routes/apiRouter';
import { Server, Socket } from 'socket.io';
const app: Application = express();
import { agentStatus } from './routes/globals'
const port = debug.PORT;

const PORT = port || 3000;
const server: any = http.createServer(app).listen(PORT, () => {
  console.log('Running at port', PORT);
})
const io = new Server(server);

io.on('connection', (socket: Socket) => {
  console.log('endpoint connected');
  socket.on('disconnect', () => {
    console.log('endpoint disconnected');
  });
  socket.on('ctiEvent', (payload) => {
    console.log('payload', payload);
    if (payload.target == 'admin') {
      switch (payload.command) {
        case 'login':
          agentStatus.set(payload.agentId, true);
          break;
        case 'logout':
          agentStatus.delete(payload.agentId);
          break;
        case 'availability':
          agentStatus.set(payload.agentId, payload.availability);
          break;
      }
    }
    io.emit('ctiEvent', payload);
  });
});

const publicDirectoryPath = path.join(__dirname, "./public");
app.use(express.static(publicDirectoryPath));


app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.use('/cti-simulator/pages', pageRouter);
app.use('/cti-simulator/apis', apiRouter);
app.get('/', (req: Request, res: Response, next) => res.render('index'));
app.use((req, res, next) => {
  if (req.protocol === 'http') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

