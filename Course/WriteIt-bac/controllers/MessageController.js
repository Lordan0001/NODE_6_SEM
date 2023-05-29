import MessageModel from '../models/Message.js';

export const getAllMessages = async (req, res) => {
  try {
    const messages = await MessageModel.find().exec();
    res.json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось загрузить сообщения',
    });
  }
};

export const addMessage = async (req, res) => {
  try {
    const messageData = req.body; // Assumes that message data is passed in the request body

    // Create a new message
    const newMessage = new MessageModel(messageData);

    // Check the number of messages
    const count = await MessageModel.countDocuments();
    if (count >= 10) {
      // If there are 10 or more messages, delete the oldest one
      const oldestMessage = await MessageModel.findOne().sort({ _id: 1 }); // Find the oldest message by the _id field
      await oldestMessage.remove(); // Remove the oldest message from the database
    }

    // Save the new message
    const savedMessage = await newMessage.save();
    res.json(savedMessage);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed to add the message',
    });
  }
};

