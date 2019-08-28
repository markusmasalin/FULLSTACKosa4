const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `MONGODB_URI=mongodb+srv://blogi:Cantona7@cluster0-asfdb.mongodb.net/blog-app?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true })

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String, 
  likes: number,
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
  title: 'First Blog ',
  author: 'Jimmy Star',
  url: 'www.jimmystar.com',
  likes: 300
})

blog.save().then(() => {
  console.log('blog saved!')
  mongoose.connection.close()
})
