import LikeModel from '../models/Like.js';

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
    const { userId, body: { postId } } = req;

    const existingLike = await LikeModel.findOne({ user: userId, post: postId });
    if (existingLike) {

      await existingLike.remove();
      return res.json({ message: 'Like removed' });
    }

    const doc = new LikeModel({
      user: userId,
      post: postId
    });

    const like = await doc.save();

    res.json(like);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Unable to like',
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
