import CategoryModel from '../models/Category.js';

export const getAllCategories = async (req, res) => {
  try {
    const posts = await CategoryModel.find().exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить категории',
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const doc = new CategoryModel({
      category: req.body.category,
    });

    const category = await doc.save();

    res.json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не добавить категорию',
    });
  }
};
