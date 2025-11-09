import { sequelize, DataTypes } from "../database/database.js";

const Barang = sequelize.define("Barang", {
  nama: DataTypes.STRING,
  harga: DataTypes.INTEGER,
  stok: DataTypes.INTEGER
});

export default Barang;
