var mongoose = require('mongoose');
var blog = mongoose.model('blog');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
res.status(status).json(content);
};


/*DONE GET list of blogs */
module.exports.blogList = function(req, res) {
  console.log("Getting Blog List");
  blog
   .find()
   .exec(function(err, results){
     if(!results){
       sendJSONresponse(res, 404, {
         "message" : "no blogs found"
       });
       return;
     }else if (err){
       console.log(err);
       sendJSONresponse(res, 404, err);
       return;
     }
     console.log(results);
     sendJSONresponse(res, 200, buildBlogList(req, res, results));
   });
};

var buildBlogList = function(req, res, results) {
  var blogList = [];
  results.forEach(function(obj) {
    blogList.push({
      blogTitle: obj.blogTitle,
      blogText: obj.blogText,
      name: obj.name,
      email: obj.email,
      createdOn: obj.createdOn,
      _id: obj._id
    });
  });
  return blogList;
};

/* GET a blog by the id */
module.exports.blogReadOne = function(req, res) {
  console.log('Finding blog details', req.params);
  if (req.params && req.params.blogid) {
    blog
      .findById(req.params.blogid)
      .exec(function(err, blog) {
        if (!blog) {
          sendJSONresponse(res, 404, {
            "message": "blogid not found"
          });
          return;
        } else if (err) {
          console.log(err);
          sendJSONresponse(res, 404, err);
          return;
        }
        console.log(blog);
        sendJSONresponse(res, 200, blog);
      });
  } else {
    console.log('No blogid specified');
    sendJSONresponse(res, 404, {
      "message": "No blogid in request"
    });
  };
};

/*DONE POST a new blog */
/* /api/blogs */
module.exports.blogCreate = function(req, res) {
  console.log(req.body);
  blog.create({
    blogTitle: req.body.blogTitle,
    blogText: req.body.blogText,
    name: req.body.name,
    email: req.body.email
  }, function(err, blog) {
    if (err) {
      console.log(err);
      sendJSONresponse(res, 400, err);
    } else {
      console.log(blog);
      sendJSONresponse(res, 201, blog);
    }
  });
};

/* PUT /api/blogs/:blogid */
module.exports.blogUpdateOne = function(req, res) {
  if (!req.params.blogid) {
    sendJSONresponse(res, 404, {
      "message": "Not found, blogid is required"
    });
    return;
  }
  blog
    .findById(req.params.blogid)
    .exec(
      async function(err, blog) {
        if (!blog) {
          sendJSONresponse(res, 404, {
            "message": "blogid not found"
          });
          return;
        } else if (err) {
          sendJSONresponse(res, 400, err);
          return;
        }
        blog.blogTitle = req.body.blogTitle;
        blog.blogText = req.body.blogText;
        blog.save(function(err, blog) {
          if (err) {
            sendJSONresponse(res, 404, err);
          } else {
            sendJSONresponse(res, 200, blog);
          }
        });
      }
  );
};

/* DELETE /api/blogs/:blogid */
module.exports.blogDeleteOne = function(req, res) {
   console.log("Deleting blog entry with id of " + req.params.blogid);
   console.log(req.body);
   blog
    .findByIdAndRemove(req.params.blogid)
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
