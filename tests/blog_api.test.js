const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')



describe('when there is initially some blog saved', () => {

    beforeEach(async () => {
        await Blog.deleteMany({})
        
        const blogObjects = helper.initialBlogs
            .map(blog => new Blog(blog))
            const promiseArray = blogObjects.map(blog => blog.save())
            await Promise.all(promiseArray)
        /*
    
        let blogObject = new Blog(helper.initialBlogs[0])
        await blogObject.save()
    
        blogObject = new Blog(helper.initialBlogs[1])
        await blogObject.save()
        */
    })



    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(helper.initialBlogs.length)
    })


describe('viewing a specific blog', () => {
    test('blogs are returned with id', async () => {
        const response = await api.get('/api/blogs')
        const id = response.body.map(n => n.id)
        expect(id).toBeDefined()
        
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')

        const authors = response.body.map(r => r.author)
    
        expect(authors).toContain(
            'Arnold'
        )
    })
    
    test('a specific blog can be viewed', async () => {
        const blogsAtStart = await helper.blogsInDb()
      
        const blogToView = blogsAtStart[0]
      
        const resultBlog = await api
          .get(`/api/blogs/${blogToView.id}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)
      
        expect(resultBlog.body).toEqual(blogToView)
      })

    test('the first blog is about Beers', async () => {
        const response = await api.get('/api/blogs')
    
        expect(response.body[0].title).toBe('Best of beers')
    })
})

describe('addition of a new blog', () => {
    test('blog without title and url is not added', async () => {
        const newBlog = {
            author: 'George ',
            likes: 3
          }
          const blogsAtStart = await helper.blogsInDb()
          console.log(blogsAtStart + 'blogsAtStart')
        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
        const blogsAtEnd = await helper.blogsInDb()
        
        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
      })

    test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'async calls',
      author: 'Eric Cantona',
      url: 'ericcantona.com',
      likes: 3
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(n => n.title)
    expect(titles).toContain(
      'async calls'
    )
  })

  

  test('blog without likes gives 0 likes', async () => {
     const blogsAtStart = await helper.blogsInDb()
     console.log(blogsAtStart + 'blogs at start')
    const newBlog = {
        title: 'Life of George',
        author: 'George ',
        url: 'lifeofgeorge.com',
      }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    const likesAtEnd = blogsAtEnd.map(n => n.likes)
    expect(likesAtEnd[3]).toBe(0)
    
  })
})

describe('deletion of a blog', () => {
  
    test('a blog can be deleted', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]
    
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
    
      const blogsAtEnd = await helper.blogsInDb()
    
      expect(blogsAtEnd.length).toBe(
        blogsAtStart.length - 1
      )
    
      const titles = blogsAtEnd.map(r => r.title)
    
      expect(titles).not.toContain(blogToDelete.title)
    })
  })

/*

describe('updating of a blog', () => {

  test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    
    const blog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes +1,
      }

    if (blogToUpdate.title === undefined) {
        return blogToUpdate.status(400).json({ error: 'title missing' })
      }

    const resultBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blog)
      .expect(200)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    const updatedBlog = blogsAtEnd[0]

    
    
    expect(updatedBlog.likes).toBe(blog.likes)
    
    })
  })
*/
})

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
      const user = new User({ username: 'root', password: 'sekret' })
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'markusm',
        name: 'Markus Masalin',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })
    
    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      expect(result.body.error).toContain('`username` to be unique')
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd.length).toBe(usersAtStart.length)
      
    })
  })



afterAll(() => {
  mongoose.connection.close()
})