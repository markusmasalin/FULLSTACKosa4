  
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    console.log(request.params)
    const users = await User
      .find({}).populate('blogs', { author: 1, title: 1 })
      
    response.json(users.map(u => u.toJSON()))
  })

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body
    console.log(request.body)

    const saltRounds = 10
    console.log(body.username)
    console.log(body.password)
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    console.log(passwordHash)
    console.log(body)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })
    console.log(user)

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter