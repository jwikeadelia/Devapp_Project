import { sequelize, DataTypes } from "../database/database.js";
import Barang from "./Barang.js";
import user from "./users.js";

const BarangKeluar = sequelize.define("BarangKeluar", {
  jumlah: DataTypes.INTEGER,
  tanggal: DataTypes.DATE,
});

// Relasi: BarangKeluar milik satu Barang
BarangKeluar.belongsTo(Barang, { foreignKey: "id_barang", as: "barang" });
Barang.hasMany(BarangKeluar, { foreignKey: "id_barang", as: "barangKeluars" });

// Relasi: BarangKeluar dicatat oleh satu User
BarangKeluar.belongsTo(user, { foreignKey: "user_id", as: "user" });
user.hasMany(BarangKeluar, { foreignKey: "user_id", as: "barangKeluars" });

export default BarangKeluar;