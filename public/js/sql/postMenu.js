
/////POOOST
document.getElementById('postMenuForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = {
    dishId: formData.get('dishId'),
    name: formData.get('name'),
    amount: formData.get('amount'),
    description: formData.get('description')
  };

  try {
    const response = await fetch('/sql/post-menu', {
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

//GET ALLL
document.getElementById('getAllBtn').addEventListener('click', async function () {
  try {
    const response = await fetch('/sql/get-all-menu');
    const data = await response.json();

    renderTable(data);
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    renderError("Error obteniendo todos los registros");
  }
});

///GET ONE
document.getElementById('getOneMenuForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  const id = document.getElementById('id').value;

  try {
    const response = await fetch(`/sql/get-one-menu/${id}`);
    if (!response.ok) {
      renderError("No se encontró ningún registro");
      return;
    }
    const data = await response.json();

    renderTable([data]);
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
      <td>${entry.dishId}</td>
      <td>${entry.name}</td>
      <td>${entry.amount}</td>
      <td>${entry.description}</td>
    `;
    tableBody.appendChild(row);
  });
}


function renderError(message) {
  const tableBody = document.querySelector('#getAllResult tbody');
  tableBody.innerHTML = `<tr><td colspan="4">${message}</td></tr>`;
}
