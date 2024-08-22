function handleErrors(error,req,res,next){
    console.log(error);
    if(error.code===404){
        return res.status(404).render('shared/404',{error:error.message});
    }
    res.render('shared/500',{error:error.message});
    
}

module.exports= handleErrors;