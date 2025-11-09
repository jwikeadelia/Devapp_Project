// import { Sequelize, DataTypes } from "sequelize";

// const sequelize = new Sequelize("crud_task", "root", "", {
//   host: "mysql-db",
//   dialect: "mysql",
// });

// export { sequelize, DataTypes };

import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // supaya bisa baca variabel dari .env

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
  }
);

export { sequelize, DataTypes };

