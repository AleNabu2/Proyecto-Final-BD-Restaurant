
/////POST
document.getElementById('postOrderForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = {
    orderId: formData.get('orderId'),
    date: formData.get('date'),
    status: formData.get('status'),
    staff_staffId: formData.get('staff_staffId'),
    table_tableId: formData.get('table_tableId')
  };

  try {
    const response = await fetch('/sql/post-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const message = await response.text();
    document.getElementById('postSqlResult').innerText = message;

  } catch (error) {
    console.error('Error:', error);
    document.getElementById('postSqlResult').innerText = 'Error sending the form.';
  }
});
///////POST 2 MENU A ORDEN
document.getElementById('postOrder_MenuForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = {
    order_orderId: formData.get('order_orderId'),
    menu_dishId: formData.get('menu_dishId'),
  };

  try {
    const response = await fetch('/sql/post-order_menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const message = await response.text();
    document.getElementById('postSqlResult').innerText = message;

  } catch (error) {
    console.error('Error:', error);
    document.getElementById('postSqlResult').innerText = 'Error sending the form.';
  }
});

//GET AAALLL
// Botón "Obtener todo"
document.getElementById('getAllBtn').addEventListener('click', async function () {
  try {
    const response = await fetch('/sql/get-orders-with-menus');
    const data = await response.json();

    renderTable(data);
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    renderError("Error obteniendo todos los registros");
  }
});

///GET ONE
document.getElementById('getOneOrderForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  const status = document.getElementById('status').value;

  try {
    const response = await fetch(`/sql/get-one-order2/${status}`);
    if (!response.ok) {
      renderError("No se encontró ningún registro");
      return;
    }
    const data = await response.json();


    renderTable(data);
  } catch (error) {
    console.error('Error obteniendo dato:', error);
    renderError("Error al obtener registro");
  }
});


function renderTable(data) {
  const tableBody = document.querySelector('#getAllResult tbody');
  tableBody.innerHTML = '';

  if (data.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="4">No hay registros</td></tr>';
    return;
  }

  data.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.orderId}</td>
      <td>${entry.date}</td>
      <td>${entry.status}</td>
      <td>${entry.staff_staffId}</td>
      <td>${entry.table_tableId}</td>
      <td>${entry.platos}</td>
    `;
    tableBody.appendChild(row);
  });
}


function renderError(message) {
  const tableBody = document.querySelector('#getAllResult tbody');
  tableBody.innerHTML = `<tr><td colspan="4">${message}</td></tr>`;
}
