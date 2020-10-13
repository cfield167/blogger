/*GET BlogAdd Page*/
module.exports.blogAdd = function (req, res) {
  res.render('blogAdd', {title: 'Blog Add'});
};
/*GET BlogList Page*/
module.exports.blogList = async function (req, res, next){
  res.render('blogList', {title:'Blog Edit',
   posts: [{
    blogTitle: "Day1",
    blogText: "This is my first blog post"
   },{
    blogTitle: "Day2",
    blogText: "Deep thoughts: What is the meaning of life?"
   },{
    blogTitle: "Day3",
    blogText: "I like sandwiches"
   }]
  });
};
/*GET blogEdit Page*/
module.exports.blogEdit = function (req, res){
  res.render('blogEdit', {title: 'Blog Edit'});
};

/*GET blogDelete Page*/
module.exports.blogDelete = function(req, res){
  res.render('blogDelete', {title: 'Blog Delete'});
};
