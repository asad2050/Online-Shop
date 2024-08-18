const csrf = require('csrf')
// Initialize csrf object
const tokens = new csrf();
// Middleware to generate CSRF token and attach it to the response
 function csrfMiddleware(req, res, next) {
  // Generate a CSRF token
  const secret = req.session.csrfSecret || tokens.secretSync(); // Retrieve or generate secret
  req.session.csrfSecret = secret; // Store secret in session

  // Create a CSRF token based on the secret
  const csrfToken = tokens.create(secret);
  res.locals.csrfToken = csrfToken; // Make token available in response locals
  next();
}

// Middleware to verify CSRF token
 function csrfVerify(req, res, next) {
    
  const secret = req.session.csrfSecret; // Retrieve secret from session
  const token = req.body._csrf || req.query._csrf || req.headers['x-csrf-token']; // Get token from body, query, or headers
  if (!secret || !token || !tokens.verify(secret, token)) {
      throw new Error('Invalid CSRF token');
    ;}

  next();
}

module.exports={
    csrfMiddleware,
    csrfVerify
}