import { sequelize, DataTypes } from "../database/database.js";
import Barang from "./Barang.js";
import user from "./users.js";

const BarangMasuk = sequelize.define("BarangMasuk", {
  jumlah: DataTypes.INTEGER,
  tanggal: DataTypes.DATE,
});

// Relasi: BarangMasuk milik satu Barang
BarangMasuk.belongsTo(Barang, { foreignKey: "id_barang", as: "barang" });
Barang.hasMany(BarangMasuk, { foreignKey: "id_barang", as: "barangMasuks" });

// Relasi: BarangMasuk dicatat oleh satu User
BarangMasuk.belongsTo(user, { foreignKey: "user_id", as: "user" });
user.hasMany(BarangMasuk, { foreignKey: "user_id", as: "barangMasuks" });

export default BarangMasuk;