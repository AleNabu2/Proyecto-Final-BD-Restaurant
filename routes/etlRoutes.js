const express = require("express");
const db = require("../services/firebaseService.js");
const SqlService = require("../services/sqlService.js"); // 
const router = express.Router();

// GET all - Obtener todo el staff de firebase para pasarlo a Mysql
router.get("/staff/all", async (req, res) => {
  try {
    const snapshot = await db.collection("staff").get();
    const data = [];

    snapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    console.log("Datos obtenidos de Firebase:", data.length, "registros");
    const sql = new SqlService();
    await sql.connectToDb();

    for (const staff of data) {
      try {
        await sql.query(
          "INSERT INTO staff (staffId, active, name, position) VALUES (?, ?, ?, ?)",
          [parseInt(staff.id), staff.active ? 1 : 0, staff.name, staff.position]
        );
        console.log(`Insertado: ${staff.name}`);
      } catch (insertErr) {
        console.error(`Error insertando ${staff.name}:`, insertErr.message);
      }
    }
    await sql.closeConnection();
    return res.status(200).json({
      message: "Datos importados correctamente",
      total: data.length,
    });
  } catch (err) {
    console.error("Error al obtener el staff:", err);
    return res.status(500).send("Error al obtener el staff");
  }
});

module.exports = router;
