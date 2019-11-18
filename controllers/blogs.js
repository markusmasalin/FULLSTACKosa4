const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {

  const blogs = await Blog
      .find({}).populate('user', { username: 1, name: 1 })

    response.json(blogs.map(blog => blog.toJSON()))
})
  
blogsRouter.get('/:id', async (request, response, next) => {
  
  try{
      const blog = await Blog.findById(request.params.id)
        if (blog) {
          console.log(blog)
          response.json(blog.toJSON())
        } else {
          response.status(404).end()
        }
    } catch(exception) {
      next(exception)
    }
  })

  blogsRouter.get('/:id/comments', async (request, response, next) => {
    try{
        const comment = await Comment.find({ blog: request.params.id })
          if (comment) {
            console.log(comment)
            response.json(comment)
          } else {
            response.status(404).end()
          }
      } catch(exception) {
        next(exception)
      }
    })

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body 
    console.log(request.body)
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    console.log(decodedToken + 'decodedToken')
    console.log(request + 'request')
    console.log(response +'response')
    const user = await User.findById(decodedToken.id)
    const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            user: user._id,
          })
 
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
      response.json(savedBlog)
      
    } catch(exception) {
      next(exception)
    }
  })
  
  
  blogsRouter.delete('/:id', async (request, response) => {
    console.log(request.body)
    try {
      const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
            
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'id is wrong' })
    }
    })
  
  blogsRouter.put('/:id', async (request, response, next) => {
    const { author, title, url,likes } = request.body
    const blog = {
      author, title, url, likes,
    }
      try {
        const updatedBlog = await Blog
        .findByIdAndUpdate(request.params.id, blog, { new: true })
          
        response.json(updatedBlog.toJSON())
      
      } catch(exception) {
        next(exception)
      }
    })

    blogsRouter.post('/:id/comments', async (request, response, next) => {

      const body = request.body 
      
      const blog = await Blog.findById(body.blog)
      
        try {
          const comment = new Comment({
            text: body.text,
            blog: blog
          }) 
          
          console.log(comment + 'comment')
          console.log(comment.text + 'comment text')
          const savedComment = await comment.save()
          response.json(savedComment)
          blog.comments = blog.comments.concat(comment)
          await blog.save()
        
        } catch(exception) {
          next(exception)
        }
      })

      
    
  
  module.exports = blogsRouter