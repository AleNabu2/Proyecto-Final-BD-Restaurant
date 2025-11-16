document.getElementById('loginForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const formData = new FormData(event.target);

  const dictionary = {
    q: "juanxd",
    w: "uwu",
    e: "xd2",
    r: "club",
    t: "penguin",
    y: "es",
    u: "lo",
    i: "mejor",
    o: "de",
    p: "la",
    a: "vida",
    s: "me",
    d: "encanta",
    f: "XD",
    g: "mucho",
    h: "aleja",
    j: "es",
    k: "la",
    l: "mejor",
    z: "y",
    x: "juan",
    c: "tmb",
    v: "quiero",
    b: "mucho",
    n: "a",
    m: "mis",
    "1": "amigues",
    "2": "pongan",
    "3": "bachata",
    "4": "memotenpiedad",
    "5": "tilin",
    "6": "puffle",
    "7": "pinguino",
    "8": "fife",
    "9": "elbicho",
    "*" : "memis",
    "_" : "mecaes",
    "-" : "mal",
  };

  function encrypt(password) {
    let lower = password.toLowerCase();
    const arraypassword = Array.from(lower);
    let result = "";

    for (let i = 0; i < arraypassword.length; i++) {
      let character = arraypassword[i];
      if (dictionary[character] === undefined) {
        result += character;
      } else {
        result += dictionary[character];
      }
    }
    return result;
  }

  let originalpassword = formData.get('password');
  let hashedpassword = encrypt(originalpassword);

  const data = {
    name: formData.get('name'),
    password: hashedpassword
  };

  const resultEl = document.getElementById('postNoSqlResult');

  try {
    const response = await fetch('/sql/login-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });


    const resData = await response.json().catch(() => null);

    if (response.ok && resData?.message?.toLowerCase().includes("exitos")) {
      resultEl.innerText = "Inicio de sesión exitoso";

      const overlay = document.createElement("div");
      overlay.classList.add("profile-overlay");
      overlay.innerHTML = `
        <div class="profile-card">
          <img src="http://localhost:3000${resData.image}" alt="Foto de perfil" />
          <h2>¡Bienvenido, ${resData.name}!</h2>
        </div>
      `;
      document.body.appendChild(overlay);


      setTimeout(() => {
        window.location.href = "/html/mainFukushi.html";
      }, 2500);

    } else {
      resultEl.innerText = resData?.message || "Usuario o contraseña incorrectos.";
    }

  } catch (error) {
    console.error('Error:', error);
    resultEl.innerText = 'Error iniciando sesión.';
  }
});
