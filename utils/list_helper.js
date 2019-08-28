

const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = array => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return array.length === 0
        ? 0 
        : array.reduce(reducer, 0)
}

const favoriteBlog = array => {
    const reducer = (prev, current) => {
        return (prev.likes > current.likes) ? prev : current
    }
    return array.reduce(reducer, 0)
    
}

const mostBlogs = blogs => {
    const authors = blogs.map(b => b.author);
    const mostBlogs = authors.reduce((acc, a) => ({
        ...acc,
        [a]: (acc[a] || 0) + 1,
    }),{})
    return Object.entries(mostBlogs)
    .map(([author, blogs]) => ({ author, blogs }))
    .reduce((m, a) => a.blogs > m.blogs ? a : m)
}


const mostLikes = blogs => {
    const authors = blogs.map(b => b.author.likes);
    const mostLikes = authors.reduce((map, blog) => ({
        ...map,
        [blog]: (map[blog] || 0) + 1,        
      }), {})
    
    return Object.entries(mostLikes)
    .map(([author, blogs]) => ({ author, blogs}))
    //.reduce((m, a) => a.likes > m.likes ? a : m)
       
}

    
    
module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
  }