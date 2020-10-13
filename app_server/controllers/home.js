/*get home page*/
module.exports.home = function(req,res){
  res.render('index', {title: 'Connor Field Blog Site' });
};
