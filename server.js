const express = require('express');
const bodyParser = require('body-parser');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Crear la carpeta public si no existe
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

// Servir archivos estáticos desde la carpeta public
app.use('/public', express.static(publicDir));

app.post('/generate-pdf', (req, res) => {
    const { customerName, item, quantity, price } = req.body;
    const doc = new PDFDocument();
    const filePath = path.join(publicDir, 'invoice.pdf'); // Guardar en la carpeta public

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(25).text('Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text(`Customer: ${customerName}`);
    doc.text(`Item: ${item}`);
    doc.text(`Quantity: ${quantity}`);
    doc.text(`Price: ${price}`);

    doc.end();

    res.download(filePath, 'invoice.pdf', (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error generating PDF');
        }
    });
});

// Servir archivos estáticos de React
app.use(express.static(path.join(__dirname, 'build')));

// Servir la aplicación React para cualquier ruta que no coincida con una ruta API
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
