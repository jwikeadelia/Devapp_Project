import { sequelize, DataTypes } from "../database/database.js";
import Barang from "./Barang.js";

const BarangMasuk = sequelize.define("BarangMasuk", {
  jumlah: DataTypes.INTEGER,
  tanggal: DataTypes.DATE,
});

// Relasi: BarangMasuk milik satu Barang
BarangMasuk.belongsTo(Barang, { foreignKey: "id_barang", as: "barang" });
// Barang memiliki banyak BarangMasuk
Barang.hasMany(BarangMasuk, { foreignKey: "id_barang", as: "barangMasuks" });

export default BarangMasuk;