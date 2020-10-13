/*GET BlogAdd Page*/
module.exports.blogAdd = function (req, res) {
  res.render('blogAdd', {title: 'Blog Add'});
};
/*GET BlogList Page*/
module.exports.blogList = function (req, res){
  res.render('blogList', {titile: 'Blog List'});
};
