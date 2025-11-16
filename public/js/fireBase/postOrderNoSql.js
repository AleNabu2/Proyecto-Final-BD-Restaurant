///// POST 
document.getElementById('postOrderForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const dishes = Array.from(document.querySelectorAll("#menuContainer .menu-item")).map(item => ({
    dishId: item.querySelector("input[name='dishId']").value,
    name: item.querySelector("input[name='name']").value,
    amount: parseInt(item.querySelector("input[name='amount']").value),
    description: item.querySelector("input[name='description']").value,
  }));

  const data = {
    orderId: formData.get("orderId"),
    date: new Date(formData.get("date")),
    status: formData.get("status") === "true" ? true : false,
    staff_staffId: formData.get("staff_staffId"),
    table_tableId: formData.get("table_tableId"),
    menu: dishes,
  };


  try {
    const response = await fetch('/nosql/post-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    document.getElementById('postSqlResult').innerText = result.message || 'Pedido guardado correctamente.';
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('postSqlResult').innerText = 'Error sending the form.';
  }
});

///// GET ALL 
document.getElementById('getAllBtn').addEventListener('click', async function () {
  try {
    const response = await fetch('/nosql/order/all');
    const data = await response.json();
    renderTable(data);
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    renderError("Error obteniendo todos los registros");
  }
});

///// GET ALL MENU
document.getElementById('getAllMenuForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  const orderId = document.getElementById('menuOrderId').value;

  try {
    const response = await fetch(`/nosql/order/${orderId}/menu`);
    if (!response.ok) {
      renderMenuError("No se encontró la subcolección de menú.");
      return;
    }

    const data = await response.json();
    renderMenuTable(data);
  } catch (error) {
    console.error('Error obteniendo menú:', error);
    renderMenuError("Error obteniendo los platos del menú.");
  }
});

///// GET ONE 
document.getElementById('getOneOrderForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  const id = document.getElementById('orderId').value;

  try {
    const response = await fetch(`/nosql/order/one/${id}`);
    if (!response.ok) {
      renderError("No se encontró el pedido");
      return;
    }

    const data = await response.json();
    renderTable([data]);
  } catch (error) {
    console.error('Error obteniendo dato:', error);
    renderError("Error al obtener pedido");
  }
});

///// GET ONE MENU ITEM 
document.getElementById('getOneMenuForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const orderId = document.getElementById('oneMenuOrderId').value;
  const dishId = document.getElementById('oneDishId').value;

  try {
    const response = await fetch(`/nosql/order/${orderId}/menu/${dishId}`);
    if (!response.ok) {
      renderMenuError("No se encontró el plato en esa orden.");
      return;
    }

    const data = await response.json();
    renderMenuTable([data]);
  } catch (error) {
    console.error('Error obteniendo plato:', error);
    renderMenuError("Error al obtener el plato del menú.");
  }
});


function renderTable(data) {
  const tableBody = document.querySelector('#getAllResult tbody');
  tableBody.innerHTML = '';

  if (!data || data.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5">No hay registros</td></tr>';
    return;
  }

  data.forEach(entry => {
    const row = document.createElement('tr');

    const date = entry.date?._seconds
      ? new Date(entry.date._seconds * 1000).toLocaleString()
      : 'Sin fecha';

    const status = entry.status === true
      ? 'Activa'
      : entry.status === false
        ? 'Inactiva'
        : '—';


    row.innerHTML = `
      <td>${entry.id || entry.orderId || '—'}</td>
      <td>${date}</td>
      <td>${status}</td>
      <td>${entry.staff_staffId || '—'}</td>
      <td>${entry.table_tableId || '—'}</td>
    `;
    tableBody.appendChild(row);
  });
}


function renderMenuTable(data) {
  const tableBody = document.querySelector('#menuResult tbody');
  tableBody.innerHTML = '';

  if (!data || data.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="4">No hay platos registrados</td></tr>';
    return;
  }

  data.forEach(dish => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${dish.dishId || '—'}</td>
      <td>${dish.name || '—'}</td>
      <td>${dish.amount || '—'}</td>
      <td>${dish.description || '—'}</td>
    `;
    tableBody.appendChild(row);
  });
}


function renderMenuError(message) {
  const tableBody = document.querySelector('#menuResult tbody');
  tableBody.innerHTML = `<tr><td colspan="4">${message}</td></tr>`;
}


function renderError(message) {
  const tableBody = document.querySelector('#getAllResult tbody');
  tableBody.innerHTML = `<tr><td colspan="5">${message}</td></tr>`;
}

const menuContainer = document.getElementById("menuContainer");
const addDishBtn = document.getElementById("addDishBtn");

if (addDishBtn) {
  addDishBtn.addEventListener("click", () => {
    const index = menuContainer.children.length + 1;

    const div = document.createElement("div");
    div.classList.add("menu-item");
    div.innerHTML = `
      <h4>Plato ${index}</h4>
      <label>Dish ID:</label>
      <input type="text" name="dishId" required>

      <label>Nombre:</label>
      <input type="text" name="name" required>

      <label>Precio (amount):</label>
      <input type="number" name="amount" required>

      <label>Descripción:</label>
      <input type="text" name="description" required>

      <button type="button" class="removeDishBtn">Quitar plato</button>
      <hr>
    `;

    div.querySelector(".removeDishBtn").addEventListener("click", () => {
      div.remove();
    });

    menuContainer.appendChild(div);
  });
}
