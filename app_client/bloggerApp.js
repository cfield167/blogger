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
   .when('/register', {
      templateUrl: '/common/auth/register.view.html',
      controller: 'RegisterController',
      controllerAs: 'vm'
   })
   .when('/login', {
      templateUrl: '/common/auth/login.view.html',
      controller: 'LoginController',
      controllerAs: 'vm'
   })
  .otherwise({redirectTo: '/'});

 // $locationProvider.html5Mode(true);
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

function updateBlogById($http, authentication, id, data){
  return $http.put('/api/blogs/' + id, data, {headers: { Authorization: 'Bearer ' + authentication.getToken() }});
}

function addBlog($http, authentication, data){
  return $http.post('/api/blogs/', data, { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
}

function deleteBlogById($http, authentication, id){
  return $http.delete('/api/blogs/' + id, { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
}

//controllers
app.controller('homeController', function homeController(){
  var vm = this;
  vm.pageHeader = {
    title: "Connor Field's Blog"
  }
  vm.message = "Hope you enjoy my blogs!";
});

app.controller('listController', [ '$http', 'authentication', function listController($http, authentication){
  var vm = this;
  vm.pageHeader = {
    title: 'Blog List'
  };

  getAllBlogs($http)
    .success(function (data){
    vm.blogs = data;
    vm.isLoggedIn = authentication.isLoggedIn();
    vm.message = "Blogs found";
    })
    .error(function(e) {
      vm.message = "Couldn't get the blogs"
    });
}]);

app.controller('addController', [ '$http', '$routeParams', '$state', 'authentication', function addController($http, $routeParams, $state, authentication){
   var vm = this;
   vm.blog ={};
   vm.pageHeader = {
       title: 'Blog Add'
   }

   vm.submit = function(){
     var data = vm.blog;
     data.blogTitle = userForm.blogTitle.value;
     data.blogText = userForm.blogText.value;

     addBlog($http, authentication, data)
     .success(function(data){
       vm.message = "Post Added";
       $state.go('blogList');
     })
     .error(function(e){
        vm.message = "Could not add blog " + userForm.blogTitle.text + " " + userForm.blogText.text;
     });
   }
}]);

app.controller('editController', [ '$http', '$routeParams', '$state', 'authentication', function editController($http, $routeParams, $state, authentication){
   var vm = this;
   vm.blog = {};
   vm.id = $routeParams.id;
   vm.pageHeader = {
     title: 'Blog Edit'
   };

   getBlogById($http,vm.id)
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

      updateBlogById($http, authentication, vm.id, data)
        .success(function(data) {
           vm.message = "Blog data updated";
           $state.go('blogList');
        })
        .error(function (e) {
           vm.message = "Could not update blog given id of " + vm.id + userForm.blogTitle.text + " " + userForm.blogText.text;
        });
   }
}]);

app.controller('deleteController', [ '$http', '$routeParams', '$state', 'authentication', function deleteController($http, $routeParams, $state, authentication) {
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
        deleteBlogById($http, authentication, vm.id)
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
