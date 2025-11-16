const express = require("express");
const SqlService = require("../../services/sqlService");
const router = express.Router();

// ========== POST entry to table ==========
//ORDER
router.post('/post-order', async (req, res) => {
  const { orderId, date, status, staff_staffId, table_tableId } = req.body;
  if (!orderId || !date || !status || !staff_staffId || !table_tableId) {
    return res.status(400).send("Missing fields.");
  }

  const db = new SqlService();
  try {
    await db.connectToDb();
    await db.query(
      'INSERT INTO `order` (orderId, date, status, staff_staffId, table_tableId) VALUES (?, ?, ?, ?, ?)',
      [orderId, date, status, staff_staffId, table_tableId]
    );
    res.status(200).send("Entry created");
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error creating entry.");
  } finally {
    await db.closeConnection();
  }
});

//MENU
router.post('/post-menu', async (req, res) => {
  const { dishId, name, amount, description } = req.body;
  if (!dishId || !name || !amount || !description) {
    return res.status(400).send("Missing fields.");
  }

  const db = new SqlService();
  try {
    await db.connectToDb();
    await db.query(
      `INSERT INTO menu (dishId, name, amount, description) VALUES (?, ?, ?, ?)`,
      [dishId, name, amount, description]
    );
    res.status(200).send("Entry created");
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error creating entry.");
  } finally {
    await db.closeConnection();
  }
});

//STAFF
router.post('/post-staff', async (req, res) => {
  const { staffId, name, active, position } = req.body;
  if (!staffId || !name || !active || !position) {
    return res.status(400).send("Missing fields.");
  }

  const db = new SqlService();
  try {
    await db.connectToDb();
    await db.query(
      `INSERT INTO staff (staffId, name, active, position) VALUES (?, ?, ?, ?)`, // valores
      [staffId, name, active, position]
    );
    res.status(200).send("Entry created");
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error creating entry.");
  } finally {
    await db.closeConnection();
  }
});

//TABLE
router.post('/post-table', async (req, res) => {
  const { tableId, position, active } = req.body;
  if (!tableId || !position || !active) {
    return res.status(400).send("Missing fields.");
  }

  const db = new SqlService();
  try {
    await db.connectToDb();
    await db.query(
      'INSERT INTO `table` (tableId, position, active) VALUES (?, ?, ?)',
      [tableId, position, active]
    );
    res.status(200).send("Entry created");
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error creating entry.");
  } finally {
    await db.closeConnection();
  }
});

//ORDER_HAS_MENU
router.post('/post-order_menu', async (req, res) => {
  const { order_orderId, menu_dishId } = req.body;
  if (!order_orderId || !menu_dishId) {
    return res.status(400).send("Missing fields.");
  }

  const db = new SqlService();
  try {
    await db.connectToDb();
    await db.query(
      'INSERT INTO order_has_menu (order_orderId, menu_dishId) VALUES (?, ?)',
      [order_orderId, menu_dishId]
    );
    res.status(200).send("Entry created");
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error creating entry.");
  } finally {
    await db.closeConnection();
  }
});

// ========== Get ALL entries of a table ========== 

//ORDER
router.get('/get-all-order', async (req, res) => {
  const db = new SqlService();
  try {
    await db.connectToDb();
    const data = await db.query('SELECT * FROM `order`');
    res.status(200).json(data);
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error fetching data.");
  } finally {
    await db.closeConnection();
  }
});

//MENU 
router.get('/get-all-menu', async (req, res) => {
  const db = new SqlService();
  try {
    await db.connectToDb();
    const data = await db.query(`SELECT * FROM menu`);
    res.status(200).json(data);
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error fetching data.");
  } finally {
    await db.closeConnection();
  }
});

//STAFF
router.get('/get-all-staff', async (req, res) => {
  const db = new SqlService();

  try {
    await db.connectToDb();
    const data = await db.query(`SELECT * FROM staff`);
    res.status(200).json(data);
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error fetching data.");
  } finally {
    await db.closeConnection();
  }
});

//TABLE

router.get('/get-all-table', async (req, res) => {
  const db = new SqlService();

  try {
    await db.connectToDb();
    const data = await db.query('SELECT * FROM `table`');
    res.status(200).json(data);
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error fetching data.");
  } finally {
    await db.closeConnection();
  }
});

//ORDER_HAS_MENU
router.get('/get-all-order_menu', async (req, res) => {
  const db = new SqlService();
  try {
    await db.connectToDb();
    const data = await db.query('SELECT * FROM order_has_menu');
    res.status(200).json(data);
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error fetching data.");
  } finally {
    await db.closeConnection();
  }
});

// ========== Get ONE entry of a table ==========
//ORDER
router.get('/get-one-order/:status', async (req, res) => {
  const db = new SqlService();
  try {
    await db.connectToDb();
    const result = await db.query(
      'SELECT * FROM `order` WHERE status = ?',
      [req.params.status]
    );
    await db.closeConnection();

    if (result.length === 0) {
      res.status(404).send("Entry not found.");
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error retrieving info.");
  }
});


//MENU
router.get('/get-one-menu/:dishId', async (req, res) => {
  const db = new SqlService();
  try {
    await db.connectToDb();
    const result = await db.query(
      `SELECT * FROM menu WHERE dishId = ? `,
      [req.params.dishId]
    );
    await db.closeConnection();

    if (result.length === 0) {
      res.status(404).send("Entry not found.");
    } else {
      res.status(200).json(result[0]);
    }
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error retrieving info.");
  }
});


//STAFF
router.get('/get-one-staff/:active', async (req, res) => {
  const db = new SqlService();
  try {
    await db.connectToDb();
    const result = await db.query(
      `SELECT * FROM staff WHERE active = ?`,
      [req.params.active]
    );
    await db.closeConnection();

    if (result.length === 0) {
      res.status(404).send("Entry not found.");
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error retrieving info.");
  }
});


//TABLE

router.get('/get-one-table/:active', async (req, res) => {
  const db = new SqlService();
  try {
    await db.connectToDb();
    const result = await db.query(
      'SELECT * FROM `table` WHERE active = ?',
      [req.params.active]
    );
    await db.closeConnection();

    if (result.length === 0) {
      res.status(404).send("Entry not found.");
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error retrieving info.");
  }
});
module.exports = router;

//ORDER_HAS_MENU

router.get('/get-one-order_menu/:order_orderId', async (req, res) => {
  const db = new SqlService();
  try {
    await db.connectToDb();
    const result = await db.query(
      'SELECT * FROM order_has_menu WHERE order_orderId = ?',
      [req.params.order_orderId]
    );
    await db.closeConnection();

    if (result.length === 0) {
      res.status(404).send("Entry not found.");
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error retrieving info.");
  }
});
module.exports = router;

//ORDER 2 
//ORDERYMENU (como el get all)
router.get('/get-orders-with-menus', async (req, res) => {
  const db = new SqlService();
  try {
    await db.connectToDb();
    const result = await db.query(`
      SELECT 
        o.orderId,
        o.date,
        o.status, 
        o.staff_staffId, 
        o.table_tableId,
        GROUP_CONCAT(m.name SEPARATOR ', ') AS platos
      FROM \`order\` o
      JOIN order_has_menu ohm ON o.orderId = ohm.order_orderId
      JOIN menu m ON ohm.menu_dishId = m.dishId
      GROUP BY o.orderId, o.date, o.status, o.staff_staffId, o.table_tableId
    `);
    res.status(200).json(result);
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error fetching orders with menus.");
  } finally {
    await db.closeConnection();
  }
});

///GET ONE ORDER2
router.get('/get-one-order2/:status', async (req, res) => {
  const db = new SqlService();
  try {
    await db.connectToDb();

    const result = await db.query(
      `SELECT 
         o.orderId, 
         o.date, 
         o.status, 
         o.staff_staffId, 
         o.table_tableId,
         GROUP_CONCAT(m.name SEPARATOR ', ') AS platos
       FROM \`order\` o
       JOIN order_has_menu ohm ON o.orderId = ohm.order_orderId
       JOIN menu m ON ohm.menu_dishId = m.dishId
       WHERE o.status = ?
       GROUP BY o.orderId, o.date, o.status, o.staff_staffId, o.table_tableId`,
      [req.params.status]
    );

    await db.closeConnection();

    if (result.length === 0) {
      res.status(404).send("Entry not found.");
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).send("Error retrieving info.");
  }
});

///login
router.post('/login-user', async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).send("Missing fields.");
  }

  const db = new SqlService();
  try {
    await db.connectToDb();
    const result = await db.query(
      `SELECT * FROM user WHERE name = ? AND password = ?`,
      [name, password]
    );

    if (result.length > 0) {
      const user = result[0];
      res.status(200).json({
        message: "Login exitoso",
        name: user.name,
        image: user.image
      });
    } else {
      res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).json({ message: "Error en el servidor." });
  } finally {
    await db.closeConnection();
  }
});

/////////// Paginacion Mysql ////////////////

///Paginacion Order sql
router.get("/order", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 3;
  const offset = (page - 1) * limit;

  const db = new SqlService();

  try {
    await db.connectToDb();

    const rows = await db.query(
      "SELECT orderId, table_tableId, staff_staffId, status, date FROM `order` LIMIT ? OFFSET ?",
      [limit, offset]
    );

    await db.closeConnection();

    res.json({ orders: rows });
  } catch (err) {
    console.error("[ERROR /sql/order]", err);
    res.status(500).json({ error: "Error al obtener las órdenes de MySQL." });
  }
});

///Paginacion menu sql
router.get("/menu", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 3;
  const offset = (page - 1) * limit;

  const db = new SqlService();

  try {
    await db.connectToDb();

    const rows = await db.query(
      "SELECT dishId, name, amount, description FROM menu LIMIT ? OFFSET ?",
      [limit, offset]
    );

    await db.closeConnection();


    res.json({ menus: rows });
  } catch (err) {
    console.error("[ERROR /sql/menu]", err);
    res.status(500).json({ error: "Error al obtener el menú de MySQL." });
  }
});

///Paginacion staff sql
router.get("/staff", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 3;
  const offset = (page - 1) * limit;

  const db = new SqlService();

  try {
    await db.connectToDb();

    const rows = await db.query(
      "SELECT staffId, name, active, position FROM staff LIMIT ? OFFSET ?",
      [limit, offset]
    );

    await db.closeConnection();


    res.json({ staffs: rows });
  } catch (err) {
    console.error("[ERROR /sql/staff]", err);
    res.status(500).json({ error: "Error al obtener el staff de MySQL." });
  }
});

///Paginacion table sql
router.get("/table", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 3;
  const offset = (page - 1) * limit;

  const db = new SqlService();

  try {
    await db.connectToDb();

    const rows = await db.query(
      "SELECT tableId, position, active FROM `table` LIMIT ? OFFSET ?",
      [limit, offset]
    );

    await db.closeConnection();


    res.json({ tables: rows });
  } catch (err) {
    console.error("[ERROR /sql/table]", err);
    res.status(500).json({ error: "Error al obtener las mesas de MySQL." });
  }
});

module.exports = router;