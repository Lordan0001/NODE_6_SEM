import PostModel from '../models/Post.js';
import UserModel from '../models/User.js';
export const tagsGroupByOneTag = async (req, res) => {
  const tagFilter = req.params.tagfilter;
  try {
    const posts = await PostModel.find({
      tags: tagFilter
    }).exec();

    const tags = posts
        .map((obj) => obj.tags)
        .flat()
        .filter((value, index, self) => {
          return self.indexOf(value) === index;
        });

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить тэги',
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить тэги',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()
        .populate('user')
        .sort({ createdAt: -1 }) // Sort by descending order of createdAt field
        .exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getPostsBySubs = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params._id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    const subscribedTo = user.subscribedTo;
    const postsWithId = await PostModel.find({
      user: { $in: subscribedTo }
    }).populate('user').exec();

    res.json(postsWithId);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};


export const getOneByName = async (req, res) => {
  const nameSearch = req.params.id;
  const regex = new RegExp(nameSearch, 'i');

  try {
    const posts = await PostModel.find({
      title: { $regex: regex }
    }).populate('user').exec();

    if (posts.length === 0) {
      return res.status(404).json({
        message: 'Статья не найдена',
      });
    }

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось найти статью по названию',
    });
  }
};




export const getAllPopular = async (req, res) => {
  try {
    const posts = await PostModel.find()
        .populate('user')
        .sort({ viewsCount: -1 })
        .exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить популярные статьи',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось вернуть статью',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }

        res.json(doc);
      },
    ).populate('user');
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось удалить статью',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
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
      message: 'Не удалось получить статьи',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
      likes: req.userId
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags.split(','),
      },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
        {
          _id: postId,
        },
        {
          likes: req.userId,

        },
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};

export const getPostsWithTag = async (req,res) =>{
  const tagToSearch = req.params.tagname;
  try {
    const posts = await PostModel.find(
        {
          tags:tagToSearch
        }
    ).populate('user').exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи по тегу',
    });
  }
}

export const getPostsWithAndWithoutTag = async (req, res) => {
  const first = req.params.first;
  const second = req.params.second;
  try {
    const posts = await PostModel.find({
      $and: [
        { tags: first },
        { tags: { $ne: second } }
      ]
    }).populate('user').exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи по тегу',
    });
  }
}


