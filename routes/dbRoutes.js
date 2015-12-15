// include my model for this application
var tweets = require("../models/tweet.js")



// Define the routes for this controller
exports.init = function(app) {
  var passport = app.get('passport');
  //app.get('/', index); // essentially the app welcome page
  app.get('/membersOnly',checkAuthentication,doMembersOnly);
  app.post('/login',passport.authenticate('local', {
                                  failureRedirect: '/login.html',
                                  successRedirect: '/membersOnly'}));
  app.get('/logout', doLogout);

  app.get('/getTweets/:q', doSearch);
  app.get('/getSavedTweets/all', doGetTweets);
 
}


doSearch=function(req,res){

  var search_query = req.params.q;
  tweets.requestTweets(search_query, function(result){
    res.end(result);
  });
  
}


doGetTweets = function(req, res){

  tweets.getTweets(function(result){
    res.end(result);
  })

}

  
// Members Only path handler
doMembersOnly = function(req, res) {
  // We only should get here if the user has logged in (authenticated) and
  // in this case req.user should be define, but be careful anyway.
  if (req.user && req.user.displayName) {
    // Render the membership information view
    res.render('form', {title: "TweEmotions"});
  } else {
    // Render an error if, for some reason, req.user.displayName was undefined 
    res.render('error', { 'message': 'Application error...' });
  }
};

/*
 * Check if the user has authenticated
 * @param req, res - as always...
 * @param {function} next - The next middleware to call.  This is a standard
 *    pattern for middleware; it should call the next() middleware component
 *    once it has completed its work.  Typically, the middleware you have
 *    been defining has made a response and has not needed any additional 
 *    middleware.
 */
function checkAuthentication(req, res, next){
    // Passport will set req.isAuthenticated
    if(req.isAuthenticated()){
        // call the next bit of middleware
        //    (as defined above this means doMembersOnly)
        next();
    }else{
        // The user is not logged in. Redirect to the login page.
        res.redirect("/login.html");
    }
}

/* 
 * Log out the user
 */
function doLogout(req, res){
  // Passport puts a logout method on req to use.
  req.logout();
  // Redirect the user to the welcome page which does not require
  // being authenticated.
  res.redirect('/');
};

