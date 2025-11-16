const multer = require('multer');
const path = require('path');
const express = require("express");
const fs = require('fs'); 
const SqlService = require("../services/sqlService");

const router = express.Router();
const uploadPath = path.join(__dirname, '..', 'public', 'uploads'); 

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log('[INIT] Created uploads folder:', uploadPath);
} else {
  console.log('[INIT] Upload path ready:', uploadPath);
}

const storage = multer.diskStorage({ 
  destination: (req, file, cb) => { 
    console.log('[MULTER] Destination callback called');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => { 
    console.log('[MULTER] Filename callback called');
    console.log('[MULTER] Original file name:', file.originalname);
    const filename = Date.now() + path.extname(file.originalname); 
    cb(null, file.fieldname + '_' + filename);
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('image'), async (req, res) => { 
  console.log('\n========== [POST /images/upload] ==========');
  console.log('[HEADERS]', req.headers['content-type']);
  console.log('[BODY BEFORE MULTER]', req.body);
  console.log('[FILE OBJ]', req.file);

  try {
    if (!req.file) {
      console.warn('[WARN] req.file está vacío');
      return res.status(400).json({ message: 'There is no file in the request' });
    }

    const { name, password } = req.body;
    console.log('[name FIELD]', name, password);
    if (!name || !password) {
      console.warn('[WARN] name no recibido');
      return res.status(400).send("Missing fields.");
    }

    const filePath = `/uploads/${req.file.filename}`;
    console.log('[SAVED FILE PATH]', filePath);

    const db = new SqlService();
    console.log('[SQL] Connecting to DB...');
    await db.connectToDb();

    console.log('[SQL] Inserting record ->', name, password, filePath);
    await db.query(
      `INSERT INTO user (name, password, image) VALUES (?, ?, ?)`,
      [name, password, filePath]
    );

    await db.closeConnection();
    console.log('[SQL] Entry created successfully.');

    res.status(201).json({
      message: 'cuenta creada',
      filePath
    });
  } catch (err) {
    console.error('[ERROR]', err);

    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: "El nombre de usuario ya está en uso." });
    }

    res.status(500).json({
      message: 'Error creating entry.',
      error: err.message
    });
  }
});



module.exports = router;
