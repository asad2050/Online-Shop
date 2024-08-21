const bcrypt = require('bcryptjs');

const {pool} = require('../data/pgDatabase')

class User {
  constructor(email, password, firstName, lastName, street, postal, city) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = { street, postal, city };
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    // Begin transaction
    await pool.query('BEGIN');

    try {
      // Insert user data into users table
      const res = await pool.query(
        'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id',
        [this.email, hashedPassword, this.firstName, this.lastName]
      );
      const userId = res.rows[0].id;

      // Insert address data into addresses table
      await pool.query(
        'INSERT INTO addresses (street, postal_code, city, user_id) VALUES ($1, $2, $3, $4)',
        [this.address.street, this.address.postal, this.address.city, userId]
      );

      // Commit transaction
      await pool.query('COMMIT');
    } catch (err) {
      // Rollback transaction on error
      await pool.query('ROLLBACK');
      throw err;
    }
  }

  static async findById(userId) {
    const res = await pool.query(
      `SELECT users.id, users.email, users.first_name, users.last_name,users."isAdmin", addresses.street, addresses.postal_code, addresses.city
       FROM users
       LEFT JOIN addresses ON users.id = addresses.user_id
       WHERE users.id = $1`,
      [userId]
    );
    return res.rows[0];
  }

  async getUserWithSameEmail() {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [this.email]);
    return res.rows[0];
  }

  async existsAlready() {
    const existingUser = await this.getUserWithSameEmail();
    return !!existingUser;
  }

  async comparePassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }
}

module.exports = User;
