import LikeModel from '../models/Like.js';
import Comment from "../models/Comment.js";

export const getAllLikes = async (req, res) => {
  try {
    const posts = await LikeModel.find().exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'some',
    });
  }
};

export const createLike = async (req, res) => {
  try {
    const doc = new LikeModel({
      user: req.userId,
      post: req.body.postId
    });

    const comment = await doc.save();

    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не лайкнуть',
    });
  }
};



export const getCurrentLikes = async (req, res) => {
  try {
    const postId = req.params.id;

    const likesCount = await LikeModel.countDocuments({ post: postId });

    res.json({ likesCount });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Ошибка при получении лайков',
    });
  }
};
//
// export const removeComment = async (req, res) => {
//   try {
//     const commentId = req.params.id;
//
//     CommentModel.findOneAndDelete(
//         {
//           _id: commentId,
//         },
//         (err, doc) => {
//           if (err) {
//             console.log(err);
//             return res.status(500).json({
//               message: 'Не удалось удалить комментарий',
//             });
//           }
//
//           if (!doc) {
//             return res.status(404).json({
//               message: 'комментарий не найден',
//             });
//           }
//
//           res.json({
//             success: true,
//           });
//         },
//     );
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: 'Не удалось получить комментарий',
//     });
//   }
// };
//
// export const updateComment = async (req, res) => {
//   try {
//     const commentId = req.params.id;
//
//     await CommentModel.updateOne(
//         {
//           _id: commentId,
//         },
//         {
//           text: req.body.text,
//         },
//     );
//
//     res.json({
//       success: true,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: 'Не удалось обновить комментарий',
//     });
//   }
// };