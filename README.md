# Lab3
Blogger application
Second stage
app.js: holds all of the linking of the various necessary resources within the application
app_server:holds all routes, views, models, and controllers
routes: This consists of index.js, which links app.js to the controllers
controllers: render the views, and pass data to them
Views: render the client side HTML that is shown to the user
models: hold the database setup, and the shema for blog posts(not yet initialized)
Third Stage:
app_server:Only holds routes, controllers, and views necessary for rendering web pages
models: moved into app_api directory for use with mongoose
app_api:holds the REST api for this app
sends and recieves data from mongoose docs
has models, views, and controllers in directory
models: same as second stage
routes: sets responses for the api
controllers: run methods for the api
