var request = require('request');
var apiOptions = {
   server : "http://localhost:80" //change as needed
}

/*GET BlogAdd Page: DONE*/
module.exports.blogAdd = async function (req, res) {
  res.render('blogAdd', {title: 'Blog Add'});
};
/*Add post DONE*/
module.exports.addPost = async function(req, res){
  var requestOptions, path, postdata;
  path = '/api/blogs';
  postdata = {
    blogTitle: req.body.blogTitle,
    blogText: req.body.blogText
  };

  requestOptions = {
    url : apiOptions.server + path,
    method : "POST",
    json : postdata
  };

  request(
    requestOptions,
    function(err, response, body) {
      if (response.statusCode == 201) {
        return res.redirect('/blogList');
      } else {
         _showError(req, res, response.statusCode);
      }
    }
  );
};

/*GET BlogList Page DONE*/
module.exports.blogList = async function (req, res){
  var requestOptions, path;
  path = '/api/blogs';
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {},
    qs : {}
  };
  request(
    requestOptions,
    function(err, response, body){
      renderListPage(req, res, body);
    }
  );
};

/*Render the blog list page DONE*/
var renderListPage = async function(req, res, responseBody){
  res.render('blogList', {
    title: 'Blog List',
    posts: responseBody
  });
};

/*GET blogEdit Page TODO*/
module.exports.blogEdit = async function (req, res){
  var requestOptions, path;
  path = "/api/blogs/" + req.params.id;
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}
  };
  request(
  requestOptions,
  function(err, response, body) {
    renderEditPage(req, res, body);
  }
 );
};

var renderEditPage = async function(req, res, responseBody){
  res.render('blogEdit', {
    title: 'Blog Edit',
    blog: responseBody
  });
};

module.exports.editPost = async function(req, res){
  var requestOptions, path, postdata;
  var id = req.params.id;
  path = '/api/blogs/' + id;

  postdata = {
    blogTitle : req.body.blogTitle,
    blogText : req.body.blogText
  };
  requestOptions = {
   url : apiOptions.server + path,
   method : "PUT",
   json : postdata
  };
  request(
    requestOptions,
    function(err, response, body) {
      if (response.statusCode == 200) {
        return res.redirect('/blogList');
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
};

/*GET blogDelete Page*/
module.exports.blogDelete = async function (req, res){
  var requestOptions, path;
  path = "/api/blogs/" + req.params.id;
  requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}
  };
  request(
    requestOptions,
    function(err, response, body){
      renderDeletePage(req, res, body);
    }
  );
};

var renderDeletePage = async function (req, res, responseBody){
   res.render('blogDelete', {title: 'Blog Delete',
   blog : responseBody
  });
};

module.exports.deletePost = async function(req, res){
  var requestOptions, path, postdata;
  var id = req.params.id;
  path = '/api/blogs/' + id;

  requestOptions = {
    url : apiOptions.server + path,
    method : "DELETE",
    json : {}
  };

 request(
   requestOptions,
   function(err, response, body){
     if (response.statusCode ==204){
       res.redirect('/blogList')
     } else {
       _showError(req, res, response.statusCode);
     }
    }
   );
  };


var _showError = function (req, res, status) {
  var title, content;
  if (status === 404) {
    title = "404, page not found";
    content = "Oh dear. Looks like we can't find this page. Sorry.";
  } else if (status === 500) {
    title = "500, internal server error";
    content = "How embarrassing. There's a problem with our server.";
  } else {
    title = status + ", something's gone wrong";
    content = "Something, somewhere, has gone just a little bit wrong.";
  }
  res.status(status);
  res.render('generic-text', {
    title : title,
    content : content
  });
};
