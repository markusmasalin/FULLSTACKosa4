const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    text: String,
   
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    },

  })


commentSchema.set('toJSON', {
    transform: (document, returnedObject) => {
     //   returnedObject._id = returnedObject.id
        delete returnedObject.__v
     //   delete returnedObject._id
    }
})
  

module.exports = mongoose.model('Comment', commentSchema)
  