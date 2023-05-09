import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'posts not found'
        })
    }
};
export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { returnDocument: 'after' }
        );

        if (!doc) {
            return res.status(404).json({
                message: 'One post not found'
            })
        }

        res.json(doc);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to return post'
        })
    }
}


export const create = async (req, res) => {
    try{
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,//was title
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,

        });
        const post = await doc.save();
        res.json(post);
    }
    catch (err){
        console.log(err);
        res.status(500).json({
            message: 'post creation failed'
        })

    }
};