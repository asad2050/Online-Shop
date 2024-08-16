const pool = require('../data/pgDatabase').pool; // Assuming pool is exported from pgDatabase

class Order {
  constructor(cart, userData,status = 'pending', date, orderId) {
    this.productData = cart; // Array of { productId, quantity }
    this.totalQuantity = cart.totalQuantity;
    this.totalPrice = cart.totalPrice;
    this.userData=userData;
    this.status = status;
    this.date = new Date(date);
    if (this.date) {
      this.formattedDate = this.date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    if (orderId) {
      this.id = orderId;
    }
  }

  static transformOrderRow(row) {
    let userData;
    if(row.user_email){
       userData = {id:row.user_id,
        firstName :row.user_first_name,
        lastName: row.user_last_name,
        email: row.user_email,
        address:{
            street: row.user_street,
            postalCode: row.user_postal_code,
            city: row.user_city
        }
    }
  }else{
        userData = {
          id:row.user_id,
        }
    }
   
    return new Order(
      {
        items: [
          {

            product:{
                id:row.product_id,
                title: row.product_title,
                price: row.product_price
            },
            quantity: row.quantity,
            totalPrice: row.total_price // Add totalPrice to the item
          }
        ],
        totalQuantity: row.total_quantity, // Assuming this is part of the row data if needed
        totalPrice: row.total_price // Assuming this is part of the row data if needed
      },

    userData,
      row.status,
      row.date,
      row.id
    );
  }

  static transformOrderRows(rows) {
    // return rows.map(this.transformOrderRow);
    const ordersMap = new Map();

    rows.forEach(row => {
      const key = row.id;
      if (!ordersMap.has(key)) {
        ordersMap.set(key, {
          order: new Order(
            {
              items: [],
              totalQuantity: row.total_quantity,
              totalPrice: row.total_price
            },
            {
              id: row.user_id,
              firstName: row.user_first_name,
              lastName: row.user_last_name,
              email: row.user_email,
              address: {
                street: row.user_street,
                postalCode: row.user_postal_code,
                city: row.user_city
              }
            },
            row.status,
            row.date,
            row.id
          ),
          productIds: new Set()
        });
      }
      const order = ordersMap.get(key);
      if (!order.productIds.has(row.product_id)) {
        order.productIds.add(row.product_id);
        order.order.productData.items.push({
          product: {
            id: row.product_id,
            title: row.product_title,
            price: row.product_price
          },
          quantity: row.quantity,
          totalPrice: row.item_total_price
        });
      }
    });

    return Array.from(ordersMap.values()).map(({ order }) => order);

  }
  

  async save() {

    try {
      await pool.query('BEGIN');
      if (this.id) {
        // Update existing order
        await pool.query(
          'UPDATE orders SET status = $1, total_quantity = $2, total_price = $3 WHERE id = $4',
          [this.status, this.totalQuantity, this.totalPrice, this.id]
        );
        // Optionally, handle updates to order_items if necessary
      } else {
        // Insert new order
        const res = await pool.query(
          'INSERT INTO orders (user_id, status, total_quantity, total_price) VALUES ($1, $2, $3, $4) RETURNING id',
          [this.userData.id, this.status, this.totalQuantity, this.totalPrice]
        );
        this.id = res.rows[0].id;
      }

      // Add items to order_items table
      for (const item of this.productData.items) {
        await pool.query(
          'INSERT INTO order_items (order_id, product_id, product_title, product_price, quantity, total_price) VALUES ($1, $2, $3, $4, $5, $6)',
          [this.id, item.product.id, item.product.title, item.product.price, item.quantity, item.totalPrice]
        );
      }

      await pool.query('COMMIT');
    } catch (err) {
      await pool.query('ROLLBACK');
      throw err;
    } 
  }

  // static async findAll() {
  //   const res = await pool.query(
  //     `SELECT o.id, o.user_id, o.status, o.date, o.total_quantity, o.total_price, 
  //             oi.product_id, oi.product_title, oi.product_price, oi.quantity, oi.total_price as item_total_price
  //      FROM orders o
  //      JOIN order_items oi ON o.id = oi.order_id
  //      ORDER BY o.date DESC`
  //   );
  //   return this.transformOrderRows(res.rows);
  // }
  static async findAll() {
    const res = await pool.query(
      `SELECT o.id, o.user_id, o.status, o.date, o.total_quantity, o.total_price, 
              oi.product_id, oi.product_title, oi.product_price, oi.quantity, oi.total_price AS item_total_price,
              u.email AS user_email, u.first_name AS user_first_name, u.last_name AS user_last_name,
              a.street AS user_street, a.postal_code AS user_postal_code, a.city AS user_city
       FROM orders o
     INNER  JOIN order_items oi ON o.id = oi.order_id
     INNER  JOIN users u ON o.user_id = u.id
       LEFT JOIN addresses a ON u.id = a.user_id
       ORDER BY o.date DESC`
    );
    return this.transformOrderRows(res.rows);
  }
  
  static async findAllForUser(userId) {
    const res = await pool.query(
      `SELECT o.id, o.user_id, o.status, o.date, o.total_quantity, o.total_price, 
              oi.product_id, oi.product_title, oi.product_price, oi.quantity, oi.total_price as item_total_price
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       ORDER BY o.date DESC`,
      [userId]
    );
    return this.transformOrderRows(res.rows);
  }

  static async findById(orderId) {
    const res = await pool.query(
      `SELECT o.id, o.user_id, o.status, o.date, o.total_quantity, o.total_price, 
              oi.product_id, oi.product_title, oi.product_price, oi.quantity, oi.total_price as item_total_price
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE o.id = $1`,
      [orderId]
    );
    return this.transformOrderRows(res.rows)[0];
  }
}

module.exports = Order;
