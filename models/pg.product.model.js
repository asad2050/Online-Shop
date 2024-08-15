const {pool} = require('../data/pgDatabase');

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price;
    this.description = productData.description;
   
    if(
      productData.image
    ){
      this.image = productData.image; 
    }
   //name of image file
    this.updateImageData();
    if (productData.id) {
      this.id = productData.id;
    }
  }

  static async findById(productId) {
    const query = {
      text: "SELECT * FROM products WHERE id = $1",
      values: [productId],
    };
    const result = await pool.query(query);
    const product = result.rows[0];
    if (!product) {
      const error = new Error("Could not find product with provided id/");
      error.code = 404; //default http  status code for not found.
      throw error;
    }
    return new Product(product);
  }

  static async findAll() {
    const query = {
      text: "SELECT * FROM products",
      values: [],
    };
    const result = await pool.query(query);
    const products = result.rows;
    return products.map((product) => new Product(product));
  }

  static async findMultiple(ids) {
    const query = {
      text: "SELECT * FROM products WHERE id = ANY($1)",
      values: [ids],
    };
    const result = await pool.query(query);
    
    const products = result.rows;
    return products.map((product) => new Product(product));
  }

  updateImageData() {
    this.imagePath = `product-data/images/${this.image}`; //from root folder to image
    this.imageUrl = `/products/assets/images/${this.image}`;
  }

  async save() {
    let query;
    if(this.id ){
      if(!this.image){
      
        query={
          text: "UPDATE products SET title = $1, summary = $2, price = $3, description = $4  WHERE id = $5",
          values: [
            this.title,
            this.summary,
            this.price,
            this.description,
            this.id
          ],
       } //removes the image key value pair from productData object. Because we don't want to insert undefined value into image of our db.
      
    } else{
      query={
        text: "UPDATE products SET title = $1, summary = $2, price = $3, description = $4, image = $5 WHERE id = $6",
        values: [
          this.title,
          this.summary,
          this.price,
          this.description,
          this.image,
          this.id
        ],
      };
    }
      
    }else{
       query = {
      text: "INSERT INTO products (title, summary, price, description, image) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      values: [
        this.title,
        this.summary,
        this.price,
        this.description,
        this.image,
      ],
    };
  }
    const result = await pool.query(query);
    
}

  async replaceImage(newImage) {
    this.image = newImage; //name of image
    this.updateImageData();
    const query = {
      text: "UPDATE products SET image = $1 WHERE id = $2",
      values: [this.image, this.id],
    };
    await pool.query(query);
  }

  async remove() {
    const query = {
      text: "DELETE FROM products WHERE id = $1",
      values: [this.id],
    };
    await pool.query(query);
  }
}

module.exports=Product;