# Proyecto: Base de Datos para Restaurante Fukushi

Se desarrolló una base de datos enfocada en la gestión de un restaurante. La aplicación permite realizar operaciones para **visualizar la información de forma clara** e **ingresar nuevos datos** en dos modalidades distintas: **SQL (MySQL)** y **NoSQL (Firebase Firestore)**.

## Integrantes

* Alejandra Acevedo
* Natalia Noguera
* Juan Esteban Mendez

---

## Estructura de Carpetas del Proyecto

El proyecto está organizado de manera modular para separar claramente la lógica del servidor, los servicios de base de datos, las rutas principales y los archivos del front-end. (A continuación se explicara cada carpeta):

* ### 1. `/env`
    Contiene archivos de configuración **sensibles**:
    * `mysqlConfig.js`: Credenciales y parámetros de conexión a **MySQL**.
    * `serviceAccountKey.json`: Llave privada usada para autenticar **Firebase Admin**.

* ### 2. `/public`
    Carpeta accesible desde el navegador que guarda la parte **visible para el usuario (Front-end)**.

    * `/public/css`: Archivos CSS que dan estilo a las páginas HTML.
    * `/public/html`: Páginas HTML del sistema.
        * `html_sql`: Páginas del **modo SQL** (menu, order, staff, tables…) y sus paginaciones.
        * `html_fireBase`: Páginas del **modo Firebase** y sus paginaciones.
    * `/public/js`: Scripts JavaScript del Front-end.
        * `/js/sql`: Lógica para insertar registros, **paginación SQL**, peticiones GET/POST.
        * `/js/fireBase`: Lógica de **Firebase**, **paginación NoSQL**, inserciones.
        * `index.js` (registro) y `login.js` (inicio de sesión).
    * `/public/uploads`: **Multer** guarda las imágenes de perfil que suben los usuarios.

* ### 3. `/register`
    Contiene los archivos principales de autenticación:
    * `register.html`
    * `login.html`
    * `index.html` (home del login/registro)

* ### 4. `/routes`
    Contiene todas las rutas que usa el servidor **Express**.
    * `mysql/sqlRoutes.js`: Rutas para el **CRUD SQL** y paginación.
    * `mysql/etlRoutes.js`: Rutas del proceso **ETL** (Extract–Transform–Load), para exportar datos desde Firebase hacia MySQL.
    * `firebase/firebaseRoutes.js`: Rutas **CRUD de Firebase**.
    * `imagesRoutes.js`: Subida de imágenes con **Multer**.

* ### 5. `/services`
    Servicios que encapsulan la conexión con cada base de datos.
    * `sqlService.js`: Conexión, consultas y cierre de **MySQL**.
    * `firebaseService.js`: Inicialización y operaciones con **Firebase Admin**.

* ### 6. `node_modules`
    Dependencias instaladas mediante `npm`.

* ### 7. Archivos Raíz
    * `server.js`: Inicializa **Express**, carga rutas y levanta el servidor.
    * `package.json`: Dependencias del proyecto.

---

## Tecnologías Usadas

| Categoría | Tecnología |
| :--- | :--- |
| **Backend** | Node.js, Express.js |
| **Bases de Datos** | MySQL, Firebase Firestore |
| **Utilidades** | Multer (subida de imágenes), ETL personalizado |
| **Frontend** | JavaScript, HTML, CSS |

---

## Cómo Ejecutar el Proyecto

Sigue los siguientes pasos para ejecutar el proyecto localmente:

1.  **Clona este repositorio:**
    ```bash
    git clone https://github.com/AleNabu2/Proyecto-Final-BD-Restaurant.git
    ```
2.  **Comprueba si tienes instalado Node.js:**
    ```bash
    node --version
    ```
3.  **Instala las dependencias del proyecto:**
    ```bash
    npm install
    ```
4.  **Iniciar el servidor:**
    ```bash
    node server.js
    ```

---

## Flujo General y Autenticación

El sistema inicia con el **registro** del usuario. Cuando un usuario se registra, sus datos `encriptando la contraseña` se almacenan en la base de datos permitiendo guardar una foto de perfil.
Posteriormente, durante el proceso de **login**, el sistema compara la contraseña ingresada con la contraseña encriptada previamente guardada. Si coinciden, se concede acceso a la página principal.
Una vez dentro, el usuario puede **elegir** entre trabajar en modo SQL o modo NoSQL.

### Login y Cifrado

El sistema permite a los usuarios registrarse y acceder de manera segura, combinando almacenamiento de datos en **MySQL** y protección de contraseñas mediante **cifrado**.

* #### Registro de Usuario
    1.  El usuario ingresa nombre, contraseña y una imagen de perfil.
    2.  La **contraseña se cifra** usando un **diccionario de sustitución** antes de ser guardada.
    3.  La información se almacena en la tabla `user` de MySQL, junto con la **ruta de la imagen** de perfil.
    4.  El usuario es redirigido a la página principal.

* #### Login
    1.  El sistema compara la contraseña ingresada (tras ser cifrada) con la contraseña cifrada guardada en la base de datos.
    2.  Si **coinciden**, se concede acceso al usuario, quien puede elegir entre el **Modo SQL** o el **Modo NoSQL**.
    3.  Si no coinciden, el acceso se deniega.
 Este mecanismo protege la privacidad de los usuarios y asegura que las contraseñas no puedan ser leídas directamente.
       
* #### Cifrado
    El cifrado se realiza mediante un **diccionario de sustitución**, que define cómo se reemplaza cada letra o número.
    1.  La contraseña ingresada se convierte a minúsculas y se transforma en un arreglo de caracteres.
    2.  Cada carácter se revisa y se reemplaza si existe en el diccionario, si no, se mantiene igual.
    3.  El resultado (`hashedPassword`) se guarda en la base de datos en una cadena final.



### Almacenamiento de Imágenes

* Las imágenes de perfil se guardan en el servidor (`/public/uploads`) mediante **Multer**, con nombres únicos para evitar conflictos.
* La **ruta del archivo** se almacena en la base de datos (`user` en MySQL) para poder mostrar la imagen en la interfaz de usuario.

---

## Modos de Trabajo con la Base de Datos

El usuario puede elegir entre dos modalidades para gestionar la información del restaurante:

### ⦿ Modo SQL (MySQL)

El usuario puede visualizar y gestionar datos almacenados en **cuatro tablas principales**:

* **Menú**
* **Orden**
* **Staff**
* **Mesas**

Cada tabla almacena la información correspondiente, y la página permite realizar operaciones básicas como obtener todos los registros, buscar un elemento por su ID o ingresar un nuevo dato.

### ⦿ Modo NoSQL (Firebase Firestore)

La información se organiza en **dos colecciones principales** con sus respectivas subcolecciones, permitiendo una estructura flexible:

| Colección | Subcolecciones |
| :--- | :--- |
| **Orden** | Menú |
| **Staff** | Mesa |

La página permite realizar operaciones básicas como obtener todos los documentos de una colección, buscar un registro por su ID, ingresar un nuevo dato y consultar la información de sus subcolecciones, como los platos asociados a una orden.
En ambos modos, el usuario puede visualizar los registros existentes y navegar por la información de acuerdo con la estructura de cada base de datos.

---

## Sobre la Paginación (Ejemplo con SQL Menú)

En ambas modalidades (SQL y NoSQL), la página incluye una funcionalidad de paginación para cada tabla, mostrando un máximo de **3 registros por página** para facilitar la navegación y mejorar el rendimiento, evitando cargar grandes volúmenes de información simultáneamente.

* **JavaScript (Back-end – `sqlRoutes.js`):**
    * Define las rutas del servidor que consultan la base de datos y devuelven los registros paginados en formato JSON. Por ejemplo, `GET /sql/menu` devuelve los platos del menú.
    

* **JavaScript (Front-end – `menuPagSql.js`):**
    * Controla la interfaz (botones, tabla) y la lógica de paginación en el navegador mediante variables.
    * Maneja las variables `currentPage` y `pageSize`.
    * Los botones actualizan `currentPage` y llaman a la función `LoadMenus()`, que solicita al servidor los registros con los parámetros `LIMIT` y `OFFSET`. Luego se muestran en la tabla y se actualiza la página; si no hay más registros, aparece un mensaje.

* **HTML (`menuPagSql.html`):**
    * Contiene la tabla para mostrar los registros.
    * Botones de navegación (**Anterior** y **Siguiente**) y un indicador de la página actual.

---

## Integración con Firebase (ETL)

En la sección de **Staff** dentro del **Modo Firebase**, se incluye una opción para **exportar o subir** todos los datos del staff almacenados en Firebase hacia la base de datos **MySQL**.

Esta funcionalidad permite:
* **Mantener sincronizada** la información entre ambas bases de datos.
* Facilitar la **integración** y el manejo de datos desde ambos sistemas.

### - Proceso ETL (Extract–Transform–Load)

La lógica del ETL se implementa en el archivo `etlRoutes.js`. La página web (staffNoSql.html) no ejecuta directamente el ETL si no que es llamado por el endpoint `/etl/staff/all` y se llama desde esa ruta para el Front.

1.  **Extracción (Extract)**:
    * Se consulta la colección `staff` en **Firebase** (`db.collection("staff").get()`).
    * Cada documento de la coleccion se almacena temporalmente en un arreglo (`data`), conservando los campos (`id, name, position y active`).

2.  **Transformación (Transform)**:
    * Se ajustan los datos al formato requerido por **MySQL**:
        * El campo `id` se convierte a **número entero**.
        * El campo `active` se transforma en **1 (true)** o **0 (false)**.
        * `name` y `position` se mantienen.

3.  **Carga (Load)**:
    * Se establece la conexión con **MySQL** (`SqlService`).
    * Se recorre el arreglo `data` y se inserta cada registro en la tabla `staff` usando **consultas parametrizadas**:
        ```sql
        INSERT INTO staff (staffId, active, name, position) VALUES (?, ?, ?, ?)
        ```
    * Una vez insertados todos los registros, se cierra la conexión.

### Interfaz de Usuario

* En la página de Firebase (`staffNoSql.html`), el botón **"Subir staff a SQL"** llama al endpoint `/etl/staff/all`.
* Se solicita **confirmación** al usuario antes de iniciar el proceso ETL.
* Al finalizar, se muestra un mensaje con la cantidad de registros importados correctamente pero si hay algun error, el mensaje le avisa al usuario que no se lograron subir los datos a Mysql.
   
