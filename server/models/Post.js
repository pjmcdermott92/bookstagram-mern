const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    user: Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    avatar: String,
    title: {
        type: String,
        required: [true, 'A Post Title is required']
    },
    imageUrl: {
        type: String,
        required: [true, 'A Post Image URL is required']
    },
    likes: [
        {
            user: Schema.Types.ObjectId
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('post', postSchema);
