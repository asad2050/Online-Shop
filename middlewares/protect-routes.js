function protectRoutes(req,res,next){
if(!res.locals.isAuth){
    return res.redirect('/401');//telling user he/she is not authenticated
}
if(req.path.startsWith('/admin') && !res.locals.isAdmin){
   return res.redirect('/403');
}
next();
}

module.exports=protectRoutes;