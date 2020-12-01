var mongoose = require('mongoose');
var chat = mongoose.model('chat');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
res.status(status).json(content);
};

module.exports.userList = function(req, res){
  console.log("Getting User List");
  User
   .find()
   .exec(function(err, results){
     if(!results){
       sendJSONresponse(res, 404, {
         "message" : "no users found"
       });
       return;
     }else if (err){
       console.log(err);
       sendJSONresponse(res, 404, err);
       return;
     }
     console.log(results);
     sendJSONresponse(res, 200, buildUserList(req, res, results));
    });
};

var buildUserList = function(req, res, results){
  var userList = [];
  results.forEach(function(obj){
   userList.push({
     email: obj.email,
     name: obj.name,
     _id: obj._id
   });
   });
   return userList;
};

module.exports.getUser = function (req, res) {
  console.log("Getting user " + req.params.userid);
  User
   .findById(req.params.userid)
   .exec(function (err, results){
     if(!results){
      sendJSONresponse(res, 404, {
        "message" : "no chats found"
      });
      return;
      }else if(err){
        console.log (err);
        sendJSONresponse(res, 404, err);
        return;
      }
      console.log(results);
      sendJSONresponse(res, 200, results);
   });
};


/*DONE GET list of blogs */
module.exports.chatList = function(req, res) {
  console.log("Getting Chat List");
  chat
   .find()
   .exec(function(err, results){
     if(!results){
       sendJSONresponse(res, 404, {
         "message" : "no chats found"
       });
       return;
     }else if (err){
       console.log(err);
       sendJSONresponse(res, 404, err);
       return;
     }
     console.log(results);
     sendJSONresponse(res, 200, buildChatList(req, res, results));
   });
};

var buildChatList = function(req, res, results) {
  var chatList = [];
  results.forEach(function(obj) {
    chatList.push({
      chatText: obj.chatText,
      sentTo: obj.sentTo,
      email: obj.email,
      createdOn: obj.createdOn,
      _id: obj._id
    });
  });
  return chatList;
};

/*DONE POST a new blog */
/* /api/blogs */
module.exports.chatCreate = function(req, res) {
  console.log(req.body);
  chat.create({
    chatText: req.body.chatText,
    sentTo: req.body.sentTo,
    email: req.body.email
  }, function(err, chat) {
    if (err) {
      console.log(err);
      sendJSONresponse(res, 400, err);
    } else {
      console.log(chat);
      sendJSONresponse(res, 201, chat);
    }
  });
};

/* DELETE /api/blogs/:blogid */
module.exports.chatDeleteOne = function(req, res) {
   console.log("Deleting chat with id of " + req.params.blogid);
   console.log(req.body);
   chat
    .findByIdAndRemove(req.params.chatid)
    .exec(
       function(err, response){
         if(err){
            sendJSONresponse(res, 404, err);
         }else{
            sendJSONresponse(res, 204, null);
         }
      }
   );
};
