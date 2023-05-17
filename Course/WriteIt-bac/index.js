import express from 'express';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';

import { UserController, PostController, CommentController,CategoryController } from './controllers/index.js';
import {getAllComments} from "./controllers/CommentController.js";
import Comment from "./models/Comment.js";
import {getOneByName, tagsGroupByOneTag} from "./controllers/PostController.js";

mongoose
  .connect( 'mongodb+srv://admin:admin@cluster0.klivmmt.mongodb.net/blog?retryWrites=true&w=majority')
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

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/tags', PostController.getLastTags);
app.get('/subforum/:tagfilter',PostController.tagsGroupByOneTag); //new
app.get('/categories', CategoryController.getAllCategories);

app.get('/tags/:tagname',PostController.getPostsWithTag)

app.get('/search/:id',PostController.getOneByName)

app.get('/comments', CommentController.getAllComments);
app.get('/comments/:id', CommentController.getOneComment);
app.get('/posts', PostController.getAll);
app.get('/post/popular', PostController.getAllPopular);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);

app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.post('/comments',checkAuth, CommentController.createComments);
app.post('/categories', CategoryController.createCategory);

app.delete('/posts/:id', checkAuth, PostController.remove);
app.delete('/comments/:id', checkAuth, CommentController.removeComment);
app.patch(
  '/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update,
);
app.patch(
    '/comments/:id', checkAuth, CommentController.updateComment,
);


app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});
