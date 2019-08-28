const listHelper = require('../utils/list_helper')

describe('most likes', () => {
    const blogs = [
        {
          _id: "5a422a851b54a676234d17f7",
          title: "React patterns",
          author: "Michael Chan",
          url: "https://reactpatterns.com/",
          likes: 7,
          __v: 0
        },
        {
          _id: "5a422aa71b54a676234d17f8",
          title: "Go To Statement Considered Harmful",
          author: "Edsger W. Dijkstra",
          url: "tekstiäontäällä",
          likes: 5,
          __v: 0
        },
        {
          _id: "5a3848483t3g3guje393493943943",
          title: "Go To Statement Considered Harmful",
          author: "Edsger W. Dijkstra",
          url: "jotaindataa",
          likes: 3,
          __v: 0
        },
        {
          _id: "5a422b3a1b54a676234d17f9",
          title: "Canonical string reduction",
          author: "Edsger W. Dijkstra",
          url: "yksiblogiontaalla",
          likes: 12,
          __v: 0
        },
        {
          _id: "5a422b891b54a676234d17fa",
          title: "First class tests",
          author: "Robert C. Martin",
          url: "täälläonblogi",
          likes: 10,
          __v: 0
        },
        {
          _id: "5a422ba71b54a676234d17fb",
          title: "TDD harms architecture",
          author: "Robert C. Martin",
          url: "täälläonblogi",
          likes: 0,
          __v: 0
        },
        {
          _id: "5a422bc61b54a676234d17fc",
          title: "Type wars",
          author: "Robert C. Martin",
          url: "jokunettisivu",
          likes: 2,
          __v: 0
        }  
      ]
      const listWithOneBlog = [
        {
          _id: '5a422aa71b54a676234d17f8',
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          url: 'taallaonjotain',
          likes: 5,
          __v: 0
        }
      ]

      test('the favourite of 7 blogs', () => {
          const result = listHelper.mostLikes(blogs)
          expect(result).toEqual({
            author: "Robert C. Martin",
            likes: 17
          })
      })

      test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        expect(result).toEqual(listWithOneBlog[0])
      })



})

