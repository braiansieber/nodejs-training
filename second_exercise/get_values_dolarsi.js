const https = require('https');

const DOLARSI_DOLARES_URL = 'https://www.dolarsi.com/api/api.php?type=valoresprincipales';
const DOLARSI_DOLAR_OF_URL = 'https://www.dolarsi.com/api/api.php?type=genedolar&opc=of';
const DOLARSI_DOLAR_BL_URL = 'https://www.dolarsi.com/api/api.php?type=genedolar&opc=bl';
const DOLARSI_REAL_URL = 'https://www.dolarsi.com/api/api.php?type=genedolar&opc=ah';
const DOLARSI_EURO_URL = 'https://www.dolarsi.com/api/api.php?type=genedolar&opc=ta';

async function get_value(URL) {
  return new Promise((resolve, reject) => {
    https.get(URL, res => {
      res.on('data', data => {
        const data_json = JSON.parse(data.toString('utf8'));
        resolve(data_json);
      });
    });
  }).catch(err => reject(err));
}

async function get_table() {
  let contents_values = [];
  valores = await get_value(DOLARSI_DOLARES_URL);
  valores.forEach(element => {
    element.casa.nombre != 'Argentina' ? name = element.casa.nombre : name = 'Riesgo Pais Argentina';
    element.casa.compra != 0 ? compra = element.casa.compra : compra = 'No Cotiza';
    element.casa.venta != 0 ? venta = element.casa.venta : venta = 'No Cotiza';
    contents_values.push(
      {
        'Moneda': name,
        'Compra': compra,
        'Venta': venta
      });
  });
  return contents_values;
}

URLs = {
  varios: DOLARSI_DOLARES_URL,
  dolar_bl: DOLARSI_DOLAR_BL_URL,
  dolar_of: DOLARSI_DOLAR_OF_URL,
  euro: DOLARSI_EURO_URL,
  real: DOLARSI_REAL_URL
}

exports.URLs = URLs;
exports.get_value = get_value;
exports.get_table = get_table;