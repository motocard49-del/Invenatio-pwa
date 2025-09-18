let inventario = [];
let ventas = [];
let gastos = [];

function mostrar(seccion) {
  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
  const div = document.getElementById(seccion);
  div.style.display = 'block';
  if(seccion === 'inventario') renderInventario(div);
  if(seccion === 'ventas') renderVentas(div);
  if(seccion === 'gastos') renderGastos(div);
}

function renderInventario(div) {
  div.innerHTML = `
    <h2>Inventario</h2>
    <input id='nombreProd' placeholder='Producto'>
    <input id='categoriaProd' placeholder='Categoría'>
    <input id='precioProd' type='number' placeholder='Precio'>
    <input id='cantidadProd' type='number' placeholder='Cantidad'>
    <button onclick='agregarProducto()'>➕ Agregar</button>
    <table><thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Cantidad</th></tr></thead>
    <tbody id='tablaInventario'></tbody></table>`;
  const tabla = document.getElementById('tablaInventario');
  inventario.forEach(p => {
    tabla.innerHTML += `<tr><td>${p.nombre}</td><td>${p.categoria}</td><td>${p.precio.toFixed(2)}</td><td>${p.cantidad}</td></tr>`;
  });
}

function agregarProducto() {
  const nombre = document.getElementById('nombreProd').value;
  const categoria = document.getElementById('categoriaProd').value;
  const precio = parseFloat(document.getElementById('precioProd').value);
  const cantidad = parseInt(document.getElementById('cantidadProd').value);
  inventario.push({nombre, categoria, precio, cantidad});
  mostrar('inventario');
}

function renderVentas(div) {
  div.innerHTML = `
    <h2>Ventas</h2>
    <select id='productoVenta'></select>
    <input id='cantidadVenta' type='number' placeholder='Cantidad'>
    <button onclick='registrarVenta()'>🛒 Vender</button>
    <table><thead><tr><th>Producto</th><th>Cantidad</th><th>Total</th></tr></thead>
    <tbody id='tablaVentas'></tbody></table>`;
  const select = document.getElementById('productoVenta');
  inventario.forEach((p, i) => {
    select.innerHTML += `<option value='${i}'>${p.nombre} (${p.cantidad})</option>`;
  });
  const tabla = document.getElementById('tablaVentas');
  ventas.forEach(v => {
    tabla.innerHTML += `<tr><td>${v.producto}</td><td>${v.cantidad}</td><td>${v.total.toFixed(2)}</td></tr>`;
  });
}

function registrarVenta() {
  const idx = document.getElementById('productoVenta').value;
  const cant = parseInt(document.getElementById('cantidadVenta').value);
  if(!inventario[idx] || cant > inventario[idx].cantidad) return alert('Stock insuficiente');
  inventario[idx].cantidad -= cant;
  const total = cant * inventario[idx].precio;
  ventas.push({producto: inventario[idx].nombre, cantidad: cant, total});
  mostrar('ventas');
}

function renderGastos(div) {
  div.innerHTML = `
    <h2>Gastos / Compras</h2>
    <input id='detalleGasto' placeholder='Detalle'>
    <input id='montoGasto' type='number' placeholder='Monto'>
    <button onclick='registrarGasto()'>➕ Registrar</button>
    <table><thead><tr><th>Detalle</th><th>Monto</th></tr></thead>
    <tbody id='tablaGastos'></tbody></table>`;
  const tabla = document.getElementById('tablaGastos');
  gastos.forEach(g => {
    tabla.innerHTML += `<tr><td>${g.detalle}</td><td>${g.monto.toFixed(2)}</td></tr>`;
  });
}

function registrarGasto() {
  const detalle = document.getElementById('detalleGasto').value;
  const monto = parseFloat(document.getElementById('montoGasto').value);
  gastos.push({detalle, monto});
  mostrar('gastos');
}

function generarReporte() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 10;
  doc.text('📑 Reporte de Cierre', 10, y); y+=10;

  doc.text('Ventas:', 10, y); y+=10;
  let totalVentas = 0;
  ventas.forEach(v => {
    doc.text(`${v.producto} x${v.cantidad} = Q${v.total.toFixed(2)}`, 10, y); y+=10;
    totalVentas += v.total;
  });
  doc.text(`TOTAL VENTAS: Q${totalVentas.toFixed(2)}`, 10, y); y+=15;

  doc.text('Gastos:', 10, y); y+=10;
  let totalGastos = 0;
  gastos.forEach(g => {
    doc.text(`${g.detalle}: Q${g.monto.toFixed(2)}`, 10, y); y+=10;
    totalGastos += g.monto;
  });
  doc.text(`TOTAL GASTOS: Q${totalGastos.toFixed(2)}`, 10, y); y+=15;

  doc.text('Inventario Final:', 10, y); y+=10;
  inventario.forEach(p => {
    doc.text(`${p.nombre}: ${p.cantidad}`, 10, y); y+=10;
  });

  let balance = totalVentas - totalGastos;
  y+=10;
  doc.text(`BALANCE FINAL: Q${balance.toFixed(2)}`, 10, y);

  doc.save('cierre.pdf');
}