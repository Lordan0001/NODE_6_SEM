import RoleModel from '../models/Role.js';

export const getAllRoles = async (req, res) => {
  try {
    const posts = await RoleModel.find().exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить роли роли',
    });
  }
};

export const CreateRole = async (req, res) => {
  try {
    const doc = new RoleModel({
      role: req.body.role,
    });

    const category = await doc.save();

    res.json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не добавить роль',
    });
  }
};
