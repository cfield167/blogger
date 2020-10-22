var app = angular.module('bloggerApp', ['ngRoute', 'ui.router']);

//router provider
app.config(function($routeProvider){
  $routeProvider
    .when('/', {
       templateUrl: 'sites/home.html',
          controller: 'homeController',
       controllerAs: 'vm'
    })
    .when('/blogList', {
       templateUrl: 'sites/blogList.html',
          controller: 'listController',
       controllerAs: 'vm'
    })
    .when('/blogAdd', {
      templateUrl: 'sites/blogAdd.html',
          controller: 'addController',
      controllerAs: 'vm'
    })
    .when('/blogEdit/:id', {
       templateUrl: 'sites/blogEdit.html',
          controller: 'editController',
       controllerAs: 'vm'
    })
    .when('/blogDelete/:id', {
       templateUrl: 'sites/blogDelete.html',
          controller: 'deleteController',
       controllerAs: 'vm'
   })
  .otherwise({redirectTo: '/'});
 });

//state provider
app.config(function($stateProvider){
  $stateProvider
    .state('blogList', {
      url: '/blogList',
      templateUrl: 'sites/blogList.html',
      controller: 'listController'
    });
});

//REST API FUNCTIONS
function getAllBlogs($http){
   return $http.get('/api/blogs');
}

function getBlogById($http, id){
  return $http.get('/api/blogs/' + id);
}

function updateBlogById($http , id, data){
  return $http.put('/api/blogs/' + id, data);
}

function addBlog($http, data){
  return $http.post('/api/blogs/', data);
}

function deleteBlogById($http, id){
  return $http.delete('/api/blogs/' + id);
}

//controllers
app.controller('homeController', function homeController(){
  var vm = this;
  vm.pageHeader = {
    title: "Connor Field's Blog"
  }
  vm.message = "Hope you enjoy my blogs!";
});

app.controller('listController', function listController($http){
  var vm = this;
  vm.pageHeader = {
    title: 'Blog List'
  };

  getAllBlogs($http)
    .success(function (data){
    vm.blogs = data;
    vm.message = "Blogs found";
    })
    .error(function(e) {
      vm.message = "Couldn't get the blogs"
    });
});

app.controller('addController', [ '$http', '$routeParams', '$state', function addController($http, $routeParams, $state){
   var vm = this;
   vm.blog ={};
   vm.pageHeader = {
       title: 'Blog Add'
   }

   vm.submit = function(){
     var data = vm.blog;
     data.blogTitle = userForm.blogTitle.value;
     data.blogText = userForm.blogText.value;

     addBlog($http, data)
     .success(function(data){
       vm.message = "Post Added";
       $state.go('blogList');
     })
     .error(function(e){
        vm.message = "Could not add blog " + userForm.blogTitle.text + " " + userForm.blogText.text;
     });
   }
}]);

app.controller('editController', [ '$http', '$routeParams', '$state', function editController($http, $routeParams, $state){
   var vm = this;
   vm.blog = {};
   vm.id = $routeParams.id;
   vm.pageHeader = {
     title: 'Blog Edit'
   };

   getBlogById($http, vm.id)
     .success(function(data) {
       vm.blog = data;
       vm.message = "Blog data found!";
     })
     .error(function (e){
       vm.message = "Could not get blog given id of " + vm.id;
     });

   vm.submit = function(){
       var data = vm.blog;
       data.blogTitle = userForm.blogTitle.value;
       data.blogText = userForm.blogText.value;

      updateBlogById($http, vm.id, data)
        .success(function(data) {
           vm.message = "Blog data updated";
           $state.go('blogList');
        })
        .error(function (e) {
           vm.message = "Could not update blog given id of " + vm.id + userForm.blogTitle.text + " " + userForm.blogText.text;
        });
   }
}]);

app.controller('deleteController', [ '$http', '$routeParams', '$state', function deleteController($http, $routeParams, $state) {
    var vm = this;
    vm.blog = {};
    vm.id = $routeParams.id;
    vm.pageHeader = {
        title: 'Blog Delete'
    };

    getBlogById($http, vm.id)
      .success(function(data) {
        vm.blog = data;
        vm.message = "Blog data found!";
      })
      .error(function (e) {
        vm.message = "Could not get blog given id of " + vm.id;
      });

    vm.submit = function() {
        var data = {};
        deleteBlogById($http, vm.id)
          .success(function(data) {
            vm.message = "Blog data deleted!";
            $state.go('blogList');
          })
          .error(function (e) {
            vm.message = "Could not delete blog given id of " + vm.id;
          });
    }
    vm.cancel = function() {
        $state.go('blogList');
    }
}]);
