
/////POST
document.getElementById('postTableForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = {
    tableId: formData.get('tableId'),
    position: formData.get('position'),
    active: formData.get('active'),
  };

  try {
    const response = await fetch('/sql/post-table', {
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

//GET ALL

document.getElementById('getAllBtn').addEventListener('click', async function () {
  try {
    const response = await fetch('/sql/get-all-table');
    const data = await response.json();

    renderTable(data);
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    renderError("Error obteniendo todos los registros");
  }
});

///GET ONE

document.getElementById('getOneTableForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  const active = document.getElementById('active').value;

  try {
    const response = await fetch(`/sql/get-one-table/${active}`);
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
      <td>${entry.tableId}</td>
      <td>${entry.position}</td>
      <td>${entry.active}</td>
    `;
    tableBody.appendChild(row);
  });
}


function renderError(message) {
  const tableBody = document.querySelector('#getAllResult tbody');
  tableBody.innerHTML = `<tr><td colspan="4">${message}</td></tr>`;
}
