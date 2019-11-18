const mongoose = require('mongoose')
//const uniqueValidator = require('mongoose-unique-validator')



const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5
    },
    author: String,
    url: {
        type: String,
        required: true,
        minlength: 5,
    },
    likes: {
        type: Number,
        required: true,
        default: 0   
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
        }
    ]

  })


blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        returnedObject._id = returnedObject.id
        delete returnedObject.__v
        delete returnedObject._id
    }
})
  

module.exports = mongoose.model('Blog', blogSchema)
  