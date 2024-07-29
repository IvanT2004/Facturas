import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Cotizacion.css';

const Cotizacion = () => {
  const [form, setForm] = useState({
    asunto: '',
    ref: '',
    fecha: new Date().toISOString().split('T')[0],
    productos: [{ referencia: '', descripcion: '', cantidad: 1, valorUnitario: 0 }]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const newProductos = [...form.productos];
    newProductos[index][name] = value;
    setForm({ ...form, productos: newProductos });
  };

  const addProduct = () => {
    setForm({
      ...form,
      productos: [...form.productos, { referencia: '', descripcion: '', cantidad: 1, valorUnitario: 0 }]
    });
  };

  const removeProduct = (index) => {
    const newProductos = form.productos.filter((_, i) => i !== index);
    setForm({ ...form, productos: newProductos });
  };

  const calculateSubtotal = () => {
    return form.productos.reduce((acc, product) => acc + (product.cantidad * product.valorUnitario), 0);
  };

  const subtotal = calculateSubtotal();
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('COTIZACIÓN', 14, 22);
    doc.setFontSize(11);
    doc.text(`Referencia: ${form.ref}`, 14, 32);
    doc.text(`Fecha: ${form.fecha}`, 14, 37);
    doc.text(`Asunto: ${form.asunto}`, 14, 42);

    const tableColumn = ["Referencia del producto", "Descripción", "Cantidad", "Valor Unitario", "Valor Total"];
    const tableRows = [];

    form.productos.forEach(product => {
      const productData = [
        product.referencia,
        product.descripcion,
        product.cantidad,
        product.valorUnitario,
        (product.cantidad * product.valorUnitario).toFixed(2),
      ];
      tableRows.push(productData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 50 });

    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`IVA (19%): $${iva.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 16);
    doc.text(`Total: $${total.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 22);

    doc.save(`cotizacion_${form.ref}.pdf`);
  };

  return (
    <div className="cotizacion-container">
      <header className="cotizacion-header">
        <div className="logo">TU LOGO</div>
        <div className="cotizacion-info">
          <p>COTIZACIÓN #{form.ref}</p>
          <p>FECHA: {form.fecha}</p>
        </div>
      </header>
      <div className="cotizacion-body">
        <form>
          <label>
            Asunto:
            <input type="text" name="asunto" value={form.asunto} onChange={handleChange} />
          </label>
          <label>
            Referencia:
            <input type="text" name="ref" value={form.ref} onChange={handleChange} />
          </label>
          <table>
            <thead>
              <tr>
                <th>Referencia del producto</th>
                <th>Descripción del producto</th>
                <th>Cantidad</th>
                <th>Valor Unitario</th>
                <th>Valor Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {form.productos.map((product, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      name="referencia"
                      value={product.referencia}
                      onChange={(e) => handleProductChange(index, e)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="descripcion"
                      value={product.descripcion}
                      onChange={(e) => handleProductChange(index, e)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="cantidad"
                      value={product.cantidad}
                      onChange={(e) => handleProductChange(index, e)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="valorUnitario"
                      value={product.valorUnitario}
                      onChange={(e) => handleProductChange(index, e)}
                    />
                  </td>
                  <td>{product.cantidad * product.valorUnitario}</td>
                  <td>
                    <button type="button" onClick={() => removeProduct(index)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addProduct}>Agregar Producto</button>
        </form>
        <div className="cotizacion-totals">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>IVA (19%): ${iva.toFixed(2)}</p>
          <p>Total: ${total.toFixed(2)}</p>
        </div>
        <button onClick={generatePDF}>Generar PDF</button>
      </div>
    </div>
  );
};

export default Cotizacion;
