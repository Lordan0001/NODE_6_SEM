import CommentModel from '../models/Comment.js';
import Comment from "../models/Comment.js";

export const getAllComments = async (req, res) => {
  try {
    const posts = await CommentModel.find().populate('user').exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'some',
    });
  }
};

export const createComments = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      user: req.userId,
      post: req.body.postId
    });

    const comment = await doc.save();

    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать комментарий',
    });
  }
};



export const getOneComment = async (req, res) => {
  try {
    const postId = req.params.id;

    CommentModel.find(
        {
          post: postId,
        },
        (err, doc) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: 'Не удалось вернуть комментарий',
            });
          }

          if (!doc) {
            return res.status(404).json({
              message: 'комментарий не найдена',
            });
          }

          res.json(doc);
        },
    ).populate('user');
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить комментарии',
    });
  }
};

export const removeComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    CommentModel.findOneAndDelete(
        {
          _id: commentId,
        },
        (err, doc) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: 'Не удалось удалить комментарий',
            });
          }

          if (!doc) {
            return res.status(404).json({
              message: 'комментарий не найден',
            });
          }

          res.json({
            success: true,
          });
        },
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить комментарий',
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    await CommentModel.updateOne(
        {
          _id: commentId,
        },
        {
          text: req.body.text,
        },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить комментарий',
    });
  }
};