// const User = require("../models/user.model");
const User = require('../models/pg.user.model');
const authUtil = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlash = require("../util/session-flash");

function getSignup(req, res) {
  //code
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: "",
      confirmEmail: "",
      password: "",
      firstName: "",
      lastName: "",
      street: "",
      postal: "",
      city: "",
    };
  }

  res.render("customer/auth/signup", { inputData: sessionData });
}
async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body["confirm-email"],
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };
  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.firstName,
      req.body.lastName,
      req.body.street,
      req.body.postal,
      req.body.city
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body["confirm-email"])
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          "Please check your input. Password be at least 6 characters l ong, postal code must be 5 characters long",
        ...enteredData,
      },
      function () {
        res.redirect("/signup");
      }
    );

    return;
  }
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.firstName,
    req.body.lastName,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  try {
    
    const existsAlready = await user.existsAlready();
    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: "User exists already! Try loggin in instead!",
          ...enteredData,
        },
        function () {
          res.redirect("/signup");
        }
      );

      return;
    }
    await user.signup();
  } catch (error) {
    next(error);
    return;
  }
  res.redirect("/login");
}

function getLogin(req, res, error) {
  let sessionData= sessionFlash.getSessionData(req);
  if(!sessionData){
    sessionData={
      email:"",
      password:''
    }
  }
  res.render("customer/auth/login",{inputData:sessionData});
}

async function login(req, res, next) {
  
  if(!validation.userCredentialsAreValid(req.body.email,req.body.password)){
    sessionFlash.flashDataToSession(req,{
      errorMessage:"Please check your input",
      email:req.body.email,
      password:req.body.password
    },function(){
      res.redirect("/login")
    })
    return
  }
  const user = new User(req.body.email, req.body.password);
  let existingUser;
  try {
       
    existingUser = await user.getUserWithSameEmail();
    
  } catch (error) {
    next(error);
    return;
  }
  const sessionErrorData = {
    errorMessage:
      "Invalid credentials - please double check your email and password",
    email: user.email,
    password: user.password,
  };
  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }
  const passwordIsCorrect = await user.comparePassword(existingUser.password);
  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }
  authUtil.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}
function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect("/login");
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
