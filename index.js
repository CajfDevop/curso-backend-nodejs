const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');
const {
  logError,
  errorHandler,
  boomErrorHandler,
} = require('./middlewares/error.handler');

const app = express();
const port = 3000;
app.use(express.json());

const whitelist = [
  'http://localhost:8080',
  'https://myapp.com',
  'http://127.0.0.1:8080',
];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('no permitido'));
    }
  },
};

app.use(cors(options));

app.get('/nueva-ruta', (req, res) => {
  res.send('Hola soy una nueva ruta');
});

routerApi(app);

//se deben ejecutar despues del router
app.use(logError); // tambien es importante el orden, primero debe ser logError
app.use(boomErrorHandler);
app.use(errorHandler); // y luego el errorHandler porque como recordaras el logError tiene el next
app.listen(port, () => {
  console.log('Mi port es: ' + port);
});
