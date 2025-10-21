import { sequelize, DataTypes } from "../database/database.js";
import Barang from "./Barang.js";

const BarangKeluar = sequelize.define("BarangKeluar", {
  jumlah: DataTypes.INTEGER,
  tanggal: DataTypes.DATE,
});

// Relasi: BarangKeluar milik satu Barang
BarangKeluar.belongsTo(Barang, { foreignKey: "id_barang", as: "barang" });
// Barang memiliki banyak BarangKeluar
Barang.hasMany(BarangKeluar, { foreignKey: "id_barang", as: "barangKeluars" });

export default BarangKeluar;