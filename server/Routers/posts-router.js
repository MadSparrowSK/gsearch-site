const {Router} = require('express')
const MongoController= require('../Mongo/MongoController')

MongoController.getHotPosts = MongoController.getHotPosts.bind(MongoController);
MongoController.createPost = MongoController.createPost.bind(MongoController);

const postsRouter = new Router();

postsRouter.get('/posts', MongoController.getAllPosts)
postsRouter.get('/posts/:id', MongoController.getPostById)
postsRouter.get('/hot-posts', MongoController.getHotPosts)
postsRouter.post('/posts', MongoController.createPost)
postsRouter.put('/posts/:id', MongoController.putPost);
postsRouter.delete('/posts/:id', MongoController.deletePost)

module.exports = postsRouter;