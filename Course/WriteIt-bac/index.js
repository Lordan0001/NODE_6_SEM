import express from 'express';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';
import https from 'https';
import mongoose from 'mongoose';
import { Server as SocketIOServer } from 'socket.io';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';
import { UserController, PostController, CommentController, CategoryController, RoleController, LikeController, MessageController } from './controllers/index.js';

mongoose
    .connect('remoute mongodb')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

const server = https.createServer(
    {
      key: fs.readFileSync('./cert/localhost.key', 'utf-8'),
      cert: fs.readFileSync('./cert/localhost.crt', 'utf-8'),
    },
    app
);

const io = new SocketIOServer(server, {
  cors: {
    origin: 'https://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const clients = new Map();
io.on('connection', (socket) => {
  console.log('New client connected');

  clients.set(socket.id, socket);


  socket.on('newPost', (data) => {

    console.log('Received new post from client:', data);


    socket.broadcast.emit('newPost', data);
  });

  socket.on('chatMessage', (data) => {
    console.log('Received chat message:', data);

    io.emit('chatMessage', data);
  });


  socket.on('disconnect', () => {
    console.log('Client disconnected');


    clients.delete(socket.id);
  });

});

app.get('/auth/me', checkAuth, UserController.getMe);
app.get('/posts', PostController.getAll);
app.get('/post/popular', PostController.getAllPopular);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.get('/subs/:_id', PostController.getPostsBySubs);
app.get('/categories', CategoryController.getAllCategories);
app.get('/like', LikeController.getAllLikes);
app.get('/like/:id', LikeController.getCurrentLikes);
app.get('/comments', CommentController.getAllComments);
app.get('/comments/:id', CommentController.getOneComment);
app.get('/tags', PostController.getLastTags);
app.get('/tags/:tagname', PostController.getPostsWithTag);
app.get('/subforum/:tagfilter', PostController.tagsGroupByOneTag);
app.get('/search/:id', PostController.getOneByName);
app.get('/hide/:first/:second', PostController.getPostsWithAndWithoutTag);
app.get('/subscribe/:id', UserController.getSubscribersFromUser);
app.get('/message', MessageController.getAllMessages)

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.post('/comments', checkAuth, CommentController.createComments);
app.post('/like', checkAuth, LikeController.createLike);
app.post('/categories', CategoryController.createCategory);
app.post('/roles', RoleController.CreateRole);
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({ url: `/uploads/${req.file.originalname}` });
});
app.post('/message',checkAuth, MessageController.addMessage)

app.delete('/posts/:id', checkAuth, PostController.remove);
app.delete('/comments/:id', checkAuth, CommentController.removeComment);

app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);
app.patch('/comments/:id', checkAuth, CommentController.updateComment);
app.patch('/subscribe', checkAuth, UserController.Subscribe);

server.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});
