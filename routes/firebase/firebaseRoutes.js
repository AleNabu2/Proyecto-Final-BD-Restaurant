const express = require("express");
const db = require("../../services/firebaseService.js");
const router = express.Router();

//Ordenes/
// ========== GET all - Obtener todas las ordenes ==========
router.get("/order/all", async (req, res) => {
  try {
    const snapshot = await db.collection("order").get();

    const data = [];
    snapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json(data);
  } catch (err) {
    console.error("Error al obtener las ordenes:", err);
    return res.status(500).send("Error al obtener las ordenes");
  }
});

// ========== GET one Order by ID ==========
router.get("/order/one/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const docRef = db.collection("order").doc(orderId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send(`No se encontró la orden con ID '${orderId}'`);
    }

    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error("Error al obtener la orden:", err);
    return res.status(500).send("Error al obtener la orden");
  }
});

// ========== POST Crear una orden ==========
router.post("/post-order", async (req, res) => {
  const order = "order";
  try {
    const { orderId, date, status, staff_staffId, table_tableId, menu } = req.body;

    if (!orderId || !date || !status || !staff_staffId || !table_tableId) {
      return res.status(400).json({ error: "Faltan campos" });
    }
    const orderData = {
      date: new Date(date),
      status: status,
      staff_staffId: staff_staffId,
      table_tableId: table_tableId
    };
    const orderRef = db.collection("order").doc(orderId);
    await orderRef.set(orderData);
    await db.collection("order").doc(orderId).set(orderData);

    if (Array.isArray(menu) && menu.length > 0) {
      const menuRef = orderRef.collection("menu");
      for (const dish of menu) {
        if (!dish.dishId) continue;
        await menuRef.doc(dish.dishId).set({
          name: dish.name,
          amount: dish.amount,
          description: dish.description || "",
        });
      }
    }
    return res.status(201).json({ message: "Orden creada exitosamente", id: orderId });
  } catch (error) {
    console.error("Error creando la orden:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET ALL MENU
router.get('/order/:orderId/menu', async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderRef = db.collection('order').doc(orderId);
    const menuSnapshot = await orderRef.collection('menu').get();

    if (menuSnapshot.empty) {
      return res.status(404).json({ message: 'No se encontró la subcolección de menú.' });
    }

    const menu = menuSnapshot.docs.map(doc => ({
      dishId: doc.id,
      ...doc.data()
    }));

    res.json(menu);
  } catch (error) {
    console.error('Error obteniendo menú:', error);
    res.status(500).json({ message: 'Error obteniendo menú', error });
  }
});

// GET ONE MENU
router.get('/order/:orderId/menu/:dishId', async (req, res) => {
  try {
    const { orderId, dishId } = req.params;
    const dishRef = db.collection('order').doc(orderId).collection('menu').doc(dishId);
    const dishDoc = await dishRef.get();

    if (!dishDoc.exists) {
      return res.status(404).json({ message: 'No se encontró el plato en esa orden.' });
    }

    res.json({ dishId: dishDoc.id, ...dishDoc.data() });
  } catch (error) {
    console.error('Error obteniendo plato:', error);
    res.status(500).json({ message: 'Error obteniendo plato', error });
  }
});

// Staff //
// ========== GET all - Obtener todos los empleados ==========
router.get("/staff/all", async (req, res) => {
  try {
    const snapshot = await db.collection("staff").get();
    const data = [];
    snapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json(data);
  } catch (err) {
    console.error("Error al obtener el personal:", err);
    return res.status(500).send("Error al obtener el personal");
  }
});

// GET ALL TABLE
router.get('/staff/:staffId/table', async (req, res) => {
  try {
    const { staffId } = req.params;
    const staffRef = db.collection('staff').doc(staffId);
    const tableSnapshot = await staffRef.collection('table').get();

    if (tableSnapshot.empty) {
      return res.status(404).json({ message: 'No se encontró la subcolección de mesas.' });
    }

    const tables = tableSnapshot.docs.map(doc => ({
      tableId: doc.id,
      ...doc.data()
    }));

    res.json(tables);
  } catch (error) {
    console.error('Error obteniendo mesas:', error);
    res.status(500).json({ message: 'Error obteniendo mesas', error });
  }
});

// ========== GET one staff by ID ==========
router.get("/staff/one/:staffId", async (req, res) => {
  const { staffId } = req.params;

  try {
    const docRef = db.collection("staff").doc(staffId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send(`No se encontró el empleado con ID '${staffId}'`);
    }

    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error("Error al obtener empleado:", err);
    return res.status(500).send("Error al obtener empleado");
  }
});

// GET ONE TABLE 
router.get('/staff/:staffId/table/:tableId', async (req, res) => {
  try {
    const { staffId, tableId } = req.params;
    const tableRef = db.collection('staff').doc(staffId).collection('table').doc(tableId);
    const tableDoc = await tableRef.get();

    if (!tableDoc.exists) {
      return res.status(404).json({ message: 'No se encontró la mesa en ese staff.' });
    }

    res.json({ tableId: tableDoc.id, ...tableDoc.data() });
  } catch (error) {
    console.error('Error obteniendo mesa:', error);
    res.status(500).json({ message: 'Error obteniendo mesa', error });
  }
});

// ========== POST Crear un empleado ==========
router.post("/staff/post", async (req, res) => {
  try {
    const { staffId, name, active, position, table } = req.body;

    if (!staffId || !name || !active || !position) {
      return res.status(400).json({ error: "Faltan campos" });
    }
    const staffData = {
      name: name,
      active: active,
      position: position

    };
    await db.collection("staff").doc(staffId).set(staffData);

    if (Array.isArray(table) && table.length > 0) {
      const tableRef = db.collection("staff").doc(staffId).collection("table");
      for (const mesa of table) {
        await tableRef.doc(mesa.tableId).set({
          position: mesa.position,
          active: mesa.active,
        });
      }
    }

    return res.status(201).json({ message: "Empleado creado exitosamente", id: staffId });

  } catch (error) {
    console.error("Error al crear el empleado:", error);

    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/////////// Paginacion Firebase ////////////////

//paginación de órdenes
router.get('/orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 3;
    const offset = (page - 1) * limit;

    const snapshot = await db.collection('order').get();
    const allOrders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const paginated = allOrders.slice(offset, offset + limit);
    res.json({ orders: paginated });
  } catch (err) {
    console.error('[ERROR /orders]', err);
    res.status(500).json({ error: 'Error al obtener las órdenes.' });
  }
});

// paginación de Staff
router.get('/staff', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 3;
    const offset = (page - 1) * limit;

    const snapshot = await db.collection('staff').get();
    const allStaff = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const paginated = allStaff.slice(offset, offset + limit);
    res.json({ staff: paginated });
  } catch (err) {
    console.error('[ERROR /staff]', err);
    res.status(500).json({ error: 'Error al obtener el staff.' });
  }
});

module.exports = router;
