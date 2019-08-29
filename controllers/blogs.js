
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
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
            user: user._id
          })
 
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
      response.json(savedBlog.toJSON())
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
    const body = request.body

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    }
      try {
      const updatedBlog = await blog.save()
      await 
     Blog.findByIdAndUpdate(request.params.id, blog)
     
        
        response.json(updatedBlog.toJSON())
      
      } catch(exception) {
        next(exception)
      }
    })
    
  
  module.exports = blogsRouter