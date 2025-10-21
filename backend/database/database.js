import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize("crud_task", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export { sequelize, DataTypes };
