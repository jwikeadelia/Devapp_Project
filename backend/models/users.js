import { sequelize, DataTypes } from "../database/database.js";

const user = sequelize.define("users", {
  username: DataTypes.STRING,
  password: DataTypes.STRING,
});
export default user;
