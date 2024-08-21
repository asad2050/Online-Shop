# Online Shop using PostgreSQL

## Description

This is a Node.js application using Express and PostgreSQL. The project includes user authentication, session management, file upload functionality with Multer, and integration with the Stripe API for payments. Originally developed as part of the 100 Days of Web Development by Academind using MongoDB, this version is implemented with PostgreSQL. The repository is deployment-ready, following all major security protocols.

## Table of Contents

- [Online Shop using PostgreSQL](#online-shop-using-postgresql)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Database Setup](#database-setup)
    - [**Neon**](#neon)
    - [**Docker**](#docker)
  - [Usage](#usage)
  - [Scripts](#scripts)
  - [Contributing](#contributing)
  - [License](#license)

## Installation

To install the necessary dependencies, run:

```bash
npm install
```

## Configuration

1. Rename the `sample.env` file to `.env`.
2. Copy and paste the environment variables into the `.env` file.
3. Set up the PostgreSQL database and update the `.env` file with the appropriate database connection details. If you're using Neon, your variables should start with `PG_`.
4. **Cloudinary Setup**:
   - Create an account on [Cloudinary](https://cloudinary.com/) if you don’t have one.
   - Obtain your Cloudinary credentials (Cloud Name, API Key, API Secret) from the Cloudinary dashboard.
   - Add the following variables to your `.env` file:
     ```env
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     ```
   - Ensure these environment variables are used in your application where you configure Cloudinary.

5. **Finalize the Configuration**:
   - With all necessary environment variables set, your `.env` file should be properly configured for the database and Cloudinary integration.

## Database Setup

You can set up your PostgreSQL database either via Neon or Docker:

### **Neon**

- Obtain your connection details and add them to the `.env` file with the `PG_` prefix.
- Uncomment the code in `data/pgDatabase.js` that uses the `PG_` variables, and comment/remove the code that doesn’t.

### **Docker**

1. Ensure Docker is installed and properly configured. Follow the [official Docker installation guide](https://docs.docker.com/get-docker/) if needed.
2. Rename `sample.docker-compose.yml` to `docker-compose.yml`.
3. Update the `.env` file with your PostgreSQL credentials:
   - `POSTGRES_USER`: Set your PostgreSQL username.
   - `POSTGRES_PASSWORD`: Set your PostgreSQL password.
   - `POSTGRES_DB`: Set your desired PostgreSQL database name.
4. With the Docker services running, create the database by executing the `database.sql` script:
   ```bash
   docker exec -i <your_database_container_name> psql -U <POSTGRES_USER> -d <POSTGRES_DB> -f /path/to/your/database.sql
   ```
5. Ensure your `.env` file contains the correct environment variables.

## Usage

To start the application, run:

```bash
npm start
```

## Scripts

- `npm start`: Start the application.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is not currently licensed.

---

This version maintains the clarity of your instructions while slightly improving the flow and readability.