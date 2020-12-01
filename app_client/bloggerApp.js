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
    .when('/chatList', {
       templateUrl: 'sites/users.html',
       controller: 'userController',
       controllerAs: 'vm'
    })
    .when('/user/:id', {
       templateUrl: 'sites/chat.html',
       controller: 'chatController',
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
function getUsers($http, authentication){
  return $http.get('/api/users', {headers:{Authorization: 'Bearer ' + authentication.getToken()}});
}

function getUser($http, authentication, id){
  return $http.get('/api/users/' + id, {headers:{Authorization: 'Bearer ' + authentication.getToken()}});
}

function getChats($http, authentication){
  return $http.get('/api/chat', {headers:{Authorization: 'Bearer ' + authentication.getToken()}});
}

function addChat($http, /*authenticaton,*/ data){
  return $http.post('/api/chat/', data, /*{headers:{Authorization: 'Bearer ' + authentication.getToken()}}*/);
}

//controllers
app.controller('homeController', function homeController(){
  var vm = this;
  vm.pageHeader = {
    title: "Connor Field's Blog"
  }
  vm.message = "Hope you enjoy my blogs!";
});

app.controller('userController', [ '$http', '$state', '$routeParams', 'authentication', function userController( $http, $state, $routeParams, authentication){
  var vm = this;
  vm.pageHeader = {
    title: "User List"
  };
  getUsers($http, authentication)
   .success(function (data){
   vm.users = data;
   vm.getEmail = authentication.getEmail();
   vm.message = "Users Found";
   })
   .error(function(e){
     vm.message = "Couldn't get Users";
   });
}]);

app.controller('chatController', [ '$http', '$scope', '$routeParams', '$interval', 'authentication', function chatController( $http, $scope, $routeParams, $interval, authentication){
  var vm = this;
  vm.pageHeader = {
    title: "Chat List"
  };
  vm.id = $routeParams.id;
  vm.chat = {};
  vm.user = {};

  getUser($http, authentication, vm.id)
   .success(function(data){
    vm.user = data;
    vm.message = "Got user";
    })
    .error(function(e){
      vm.message = "Couldn't get user with id of " + id;
    });

  getChats($http, authentication)
   .success(function (data){
    vm.chats = data;
    vm.message = "messages found";
    vm.getEmail = authentication.getEmail();
   })
   .error(function(e) {
     vm.message = "Couldn't get messages";
   });

  $scope.callAtInterval = function (){
     console.log("Interval occurred");
     getChats($http, authentication)
       .success(function(data){
          vm.chats = data;
          vm.message = "chats found";
       })
       .error(function(e){
          vm.message = "could not get chats";
       });
  }
  $interval(function(){$scope.callAtInterval();}, 3000, 0, true);


   vm.submit = function(){
    var data = vm.chat;
    data.sentTo = vm.user.email;
    data.chatText = userForm.chatText.value;
    data.email = authentication.getEmail();

    addChat($http, /*authentication,*/ data)
      .success(function(data){
        vm.message = "Chat posted";
        vm.reset = "";
        //console.log("Chat Posted");
      })
      .error(function(e){
        vm.message = "Couldn't post chat";
        //console.log("Couldn't post chat");
      });
    }
}]);


app.controller('listController', [ '$http', 'authentication', function listController($http, authentication){
  var vm = this;
  vm.pageHeader = {
    title: 'Blog List'
  };

  getAllBlogs($http)
    .success(function (data){
    vm.blogs = data;
    vm.isLoggedIn = authentication.isLoggedIn();
    vm.getEmail = authentication.getEmail();
    vm.getName = authentication.getName();
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
     data.name = authentication.getName();
     data.email = authentication.getEmail();

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
