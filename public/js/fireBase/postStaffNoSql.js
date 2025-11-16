///// POST (crear empleado con sus mesas en Firebase)
document.getElementById('postStaffForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const tables = Array.from(document.querySelectorAll(".table-item")).map(item => ({
        tableId: item.querySelector("input[name='tableId']").value,
        position: item.querySelector("input[name='position']").value,
        active: item.querySelector("select[name='active']").value === "true"

    }));

    const data = {
        staffId: formData.get("staffId"),
        name: formData.get("name"),
        active: formData.get("active") === "true" ? true : false,
        position: formData.get("position"),
        table: tables,
    };

    try {
        const response = await fetch('/nosql/staff/post', {
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

///// GET ALL (traer todos los pedidos)
document.getElementById('getAllBtn').addEventListener('click', async function () {
    try {
        const response = await fetch('/nosql/staff/all');
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error('Error obteniendo datos:', error);
        renderError("Error obteniendo todos los registros");
    }
});

///// GET ALL TABLE 
document.getElementById('getAllTableForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const staffId = document.getElementById('tableStaffId').value;

    try {
        const response = await fetch(`/nosql/staff/${staffId}/table`);
        if (!response.ok) {
            renderTableError("No se encontró la subcolección de mesas.");
            return;
        }

        const data = await response.json();
        renderStaffTables(data);
    } catch (error) {
        console.error('Error obteniendo mesas:', error);
        renderTableError("Error obteniendo las mesas del staff.");
    }
});

///// GET ONE (traer un pedido por ID)
document.getElementById('getOneStaffForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const id = document.getElementById('staffIdSearch').value;

    try {
        const response = await fetch(`/nosql/staff/one/${id}`);
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

document.getElementById('getOneTableForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const staffId = document.getElementById('oneTableStaffId').value;
    const tableId = document.getElementById('oneTableId').value;

    try {
        const response = await fetch(`/nosql/staff/${staffId}/table/${tableId}`);
        if (!response.ok) {
            renderTableError("No se encontró la mesa en ese staff.");
            return;
        }

        const data = await response.json();
        renderStaffTables([data]); 
    } catch (error) {
        console.error('Error obteniendo mesa:', error);
        renderTableError("Error al obtener la mesa del staff.");
    }
});

///// Función para pintar filas
function renderTable(data) {
    const tableBody = document.querySelector('#getAllResult tbody');
    tableBody.innerHTML = '';

    if (!data || data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">No hay registros</td></tr>';
        return;
    }

    data.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${entry.staffId || entry.id || 'Sin ID'}</td>
      <td>${entry.name}</td>
      <td>${entry.active ? 'Activo' : 'Inactivo'}</td>
      <td>${entry.position}</td>
      
    `;
        tableBody.appendChild(row);
    });
}

///// Función para pintar filas de la tabla
function renderStaffTables(data) {
    const tableBody = document.querySelector('#tableResult tbody');
    tableBody.innerHTML = '';

    if (!data || data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3">No hay mesas registradas</td></tr>';
        return;
    }

    data.forEach(table => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${table.tableId || '—'}</td>
      <td>${table.position || '—'}</td>
      <td>${table.active ? 'Sí' : 'No'}</td>
    `;
        tableBody.appendChild(row);
    });
}

///// Función para mostrar errores
function renderTableError(message) {
    const tableBody = document.querySelector('#tableResult tbody');
    tableBody.innerHTML = `<tr><td colspan="3">${message}</td></tr>`;
}


///// Mostrar errores
function renderError(message) {
    const tableBody = document.querySelector('#getAllResult tbody');
    tableBody.innerHTML = `<tr><td colspan="5">${message}</td></tr>`;
}

///// AGREGAR OTRA MESA 
const tableContainer = document.getElementById("tableContainer");
const addTableBtn = document.getElementById("addTableBtn");

if (addTableBtn) {
    addTableBtn.addEventListener("click", () => {
        const index = tableContainer.children.length + 1;

        const div = document.createElement("div");
        div.classList.add("table-item");
        div.innerHTML = `
      <h4>Mesa ${index}</h4>
      <div class="input-group">
        <label for="tableId">ID Mesa</label>
        <input type="text" name="tableId" placeholder="Ej: MS001" required>
      </div>

      <div class="input-group">
        <label for="position">Posición</label>
        <input type="text" name="position" placeholder="Ej: M1" required>
      </div>

      <div class="input-group">
        <label for="active">Activa</label>
        <select name="active" required>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
      </div>

      <button type="button" class="removeTableBtn">Quitar mesa</button>
      <hr>
    `;

        div.querySelector(".removeTableBtn").addEventListener("click", () => {
            div.remove();
        });

        tableContainer.appendChild(div);
    });
}
