var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');
var ctrlBlog = require('../controllers/blog');

/*setup routes to pages*/
router.get('/', ctrlHome.home);
router.get('/blogAdd', ctrlBlog.blogAdd);
router.post('/blogAdd', ctrlBlog.addPost);
router.get('/blogList', ctrlBlog.blogList);
router.get('/blogEdit/:id', ctrlBlog.blogEdit);
router.post('/blogEdit/edit/:id', ctrlBlog.editPost);
router.get('/blogDelete/:id', ctrlBlog.blogDelete);
router.post('/blogDelete/delete/:id', ctrlBlog.deletePost);

module.exports = router;
