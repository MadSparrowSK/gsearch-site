const events = require('events')
const FileService = require('../File/FileService')
const MongoService = require('./MongoService')

const makeSlug = require('../String/slug')

class MongoController {
    constructor() {
        this.emitter = new events.EventEmitter();
    }

    async getAllPosts(req, res) {
        try {
            const posts = await MongoService.find();
            res.status(200).json(posts)
        } catch (e) {
            res.status(500).json(e);
        }
    }
    async getPostById(req,res) {
        try {
            const {id} = req.params;
            const post = await MongoService.findById(id);
            res.status(200).json(post);
        } catch (e) {
            res.status(500).json(e);
        }
    }
    async getHotPosts(req,res) {
        this.emitter.once('hotPosts', (post) => {
            res.status(200).json(post)
        })
    }
    async createPost(req, res) {
       try {
           const {author, title, description, isHotPost, content} = req.body;
           const title_slug = makeSlug(title);
           const fileName = await FileService.uploadImage(req.files, title_slug);
           const post = await MongoService.create({author, title, description, image: fileName, title_slug, content});
           if(isHotPost)
                this.emitter.emit('hotPosts', post);
           res.status(200).json(post);
       } catch (e) {
           res.status(500).json(e)
       }
    }
    async putPost(req,res) {
        try {
            const {id} = req.params;
            const {author, title, description, content} = req.body;
            const title_slug = makeSlug(title);
            let fileName = "";
            if(req.files) {
                   fileName = await FileService.uploadImage(req.files, title_slug)
            }
            const post = await MongoService.put(id, {author, title, title_slug, description, content, image: fileName});
            res.status(200).json(post);
        } catch (e) {
            res.status(404).json(e)
        }
    }
    async deletePost(req,res) {
        try {
            const {id} = req.params;
            await MongoService.delete(id);
            res.status(200).json({message:`Post with id ${id} was deleted`});
        } catch (e) {
            res.status(404).json(e)
        }
    }
}

module.exports = new MongoController();

