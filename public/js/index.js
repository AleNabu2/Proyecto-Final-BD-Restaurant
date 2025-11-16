const resultDiv = document.getElementById('result');

document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);


    const dictionary = {
        q: "juanxd", w: "uwu", e: "xd2", r: "club", t: "penguin", y: "es", u: "lo",
        i: "mejor", o: "de", p: "la", a: "vida", s: "me", d: "encanta", f: "XD",
        g: "mucho", h: "aleja", j: "es", k: "la", l: "mejor", z: "y", x: "juan",
        c: "tmb", v: "quiero", b: "mucho", n: "a", m: "mis",
        "1": "amigues", "2": "pongan", "3": "bachata", "4": "memotenpiedad",
        "5": "tilin", "6": "puffle", "7": "pinguino", "8": "fife", "9": "elbicho",
    };

    function encrypt(password) {
        let lower = password.toLowerCase();
        const arraypassword = Array.from(lower);
        let result = "";
        for (let i = 0; i < arraypassword.length; i++) {
            let character = arraypassword[i];
            result += dictionary[character] ?? character;
        }
        return result;
    }

    const originalPassword = formData.get('password');
    const encryptedPassword = encrypt(originalPassword);
    formData.set('password', encryptedPassword);

    try {
        const response = await fetch('/images/upload', {
            method: 'POST',
            body: formData
        });

        const answer = await response.json();
        console.log(answer);

        if (response.ok) {

            resultDiv.innerHTML = `
        <div class="register-card">
          <img src="${answer.filePath}" alt="Perfil" class="profile-pic">
          <h2>¡Cuenta creada con éxito!</h2>
          <p><strong>Usuario:</strong> ${formData.get('name')}</p>
          <p>Tu perfil ha sido registrado correctamente</p>
        </div>
      `;
            document.getElementById('uploadForm').style.display = 'none';
            resultDiv.style.display = 'flex';
            setTimeout(() => {
                window.location.href = "login.html";
            }, 3000);
        } else {
            resultDiv.innerHTML = `<p style="color:red;">${answer.message || "Error al crear la cuenta."}</p>`;
        }
    } catch (err) {
        console.error(err);
        resultDiv.innerHTML = '<p style="color:red;">Error al subir la imagen.</p>';
    }
});
