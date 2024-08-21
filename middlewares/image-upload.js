const multer= require('multer');
const uuid = require('uuid').v4;
const path = require("path")
const upload = multer({
    storage:multer.diskStorage({
        destination: 'product-data/images',
        filename:function(req,file,cb){
            cb(null, uuid()+ '-'+ file.originalname);

        }
    }),
    fileFilter: (req, file, cb) => {
        const filetypes =  /jpeg|jpg|png|gif|bmp|webp|svg|tiff/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
        if (mimetype && extname) {
          return cb(null, true);
        } else {
          cb('Error: Images Only!');
        }
      }
});

const configuredMulterMiddleware=upload.single('image');
module.exports= configuredMulterMiddleware;