var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});
var ctrlBlog = require('../controllers/blogs');
var ctrlAuth = require('../controllers/authentication');
var ctrlChat = require('../controllers/chats');

//posts
router.get('/blogs', ctrlBlog.blogList);
router.post('/blogs', auth, ctrlBlog.blogCreate);
router.get('/blogs/:blogid', ctrlBlog.blogReadOne);
router.put('/blogs/:blogid', auth, ctrlBlog.blogUpdateOne);
router.delete('/blogs/:blogid', auth, ctrlBlog.blogDeleteOne);
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

router.get('/users', auth, ctrlChat.userList);
router.get('/users/:userid', auth, ctrlChat.getUser);

router.get('/chat', ctrlChat.chatList);
router.post('/chat', /*auth,*/ ctrlChat.chatCreate);
router.delete('/chat', auth, ctrlChat.chatDeleteOne);


module.exports = router;
