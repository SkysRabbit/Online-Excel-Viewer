const express = require('express');
const multer = require('multer');
const path = require('path');
const ExcelJS = require('exceljs');

var router = express.Router();

// set location of uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// upload and read excel file
router.post('/upload', upload.single('excelFile'), async (req, res) => {
  if (!req.file) {
    return res.send('Please upload Excel file!').status(400);
  }

  // create dict to put JSON dictionary
  const sheetsData = {};

  // start to process uploaded excel files
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(req.file.path);
  
  workbook.eachSheet(function (worksheet, sheetId) {
    const sheetData = [];
    worksheet.eachRow((row, rowNumber) => {
      sheetData.push(row.values); // [{key: value}]
    })
    sheetsData[worksheet.name] = sheetData;
  });

  // send data to static file
  res.render('table', { sheetsData });
}) 

router.get('/others', (req, res) => {
  return res.send('example data').status(200);
})

// index page
router.get('/', (req, res) => {
  // render result to view: index.ejs
  res.render('index');
})

module.exports = router;