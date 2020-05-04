const https = require('https');

const DOLARSI_DOLARES_URL = 'https://www.dolarsi.com/api/api.php?type=valoresprincipales';
const DOLARSI_DOLAR_OF_URL = 'https://www.dolarsi.com/api/api.php?type=genedolar&opc=of';
const DOLARSI_DOLAR_BL_URL = 'https://www.dolarsi.com/api/api.php?type=genedolar&opc=bl';
const DOLARSI_REAL_URL = 'https://www.dolarsi.com/api/api.php?type=genedolar&opc=ah';
const DOLARSI_EURO_URL = 'https://www.dolarsi.com/api/api.php?type=genedolar&opc=ta';

const money_command = {
  "all": "Todos",
  "dolar_oficial": "Dolar Oficial",
  "dolar_blue": "Dolar Blue",
  "dolar_soja": "Dolar Soja",
  "dolar_ccl": "Dolar Contado con Liqui",
  "dolar_bolsa": "Dolar Bolsa",
  "bitcoin": "Bitcoin",
  "dolar": "Dolar",
  "riesgo_pais_argentina": "Riesgo Pais Argentina",
};
const help_message = ("Con los siguientes comandos obtendras las distintas monedas:\n\
  Todos: /all\n\
  Dolar Oficial: /dolar_oficial\n\
  Dolar Blue: /dolar_blue\n\
  Dolar Soja: /dolar_soja\n\
  Dolar Dolar Contado con Liqui: /dolar_ccl\n\
  Bitcoin: /bitcoin\n\
  Dolar - otra cotización: /dolar\n\
  Riesgo Pais Argentina: /riesgo_pais_argentina\n\
  En caso de querer saber una X cantidad,\n    puede realizar por ej: '/dolar_oficial 10'")

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

// Function that gets value to a money
async function get_price(money) {
  values = await get_table();
  let value_key = { exist: false }
  for (const key in values) {
    if (values[key].Moneda === money) {
      value_key = {
        Exist: true,
        Compra: values[key].Compra,
        Venta: values[key].Venta
      }
      break;
    }
  }
  return value_key;
}

async function command_get_price(ctx) {
  all_values = await get_table();
  return new Promise((resolve, reject) => {
    let money = ctx.update.message.text;
    money = money.split(" ");
    console.log(money);
    if (money.length <= 2) {
      money_value = money_command[money[0].substring(1)];
      console.log(money_value);
      if (money_value === undefined) {
        console.log('nose reconocio');
        reject(`No se reconocio el comando '${money}'.\n${help_message}`);
      } else if (money_value === "Todos") {
        let all_response = "";
        for (const key in all_values) {
          console.log(all_values);
          
          if (all_values[key].Moneda === "Riesgo Pais Argentina") {
            result = `El ${all_values[key].Moneda} es ${all_values[key].Compra}`
          } else if (all_values[key].Moneda === "Bitcoin") {
            all_values[key].Compra === "No Cotiza" ? all_values[key].Compra : all_values[key].Compra = `US$ ${all_values[key].Compra}`;
            all_values[key].Venta === "No Cotiza" ? all_values[key].Venta : all_values[key].Venta = `US$ ${all_values[key].Venta}`;
            result = `${all_values[key].Moneda}:\n  Compra: ${all_values[key].Compra}\n  Venta:     ${all_values[key].Venta}`
          }
          else {
            all_values[key].Compra === "No Cotiza" ? all_values[key].Compra : all_values[key].Compra = `$ ${all_values[key].Compra}`;
            all_values[key].Venta === "No Cotiza" ? all_values[key].Venta : all_values[key].Venta = `$ ${all_values[key].Venta}`;
            result = `${all_values[key].Moneda}:\n  Compra: ${all_values[key].Compra}\n  Venta:     ${all_values[key].Venta}`
          }
          all_response += `\n${result}`;
        }
        resolve(all_response);
      } else {
        get_price(money_value).then(data => {
          console.log(data);
          if (data.Exist) {
            if (money.length == 1) {
              if (money_value === "Riesgo Pais Argentina") {
                result = `El ${money_value} es ${data.Compra}`
              } else if (money_value === "Bitcoin") {
                data.Compra === "No Cotiza" ? data.Compra : data.Compra = `US$ ${data.Compra}`;
                data.Venta === "No Cotiza" ? data.Venta : data.Venta = `US$ ${data.Venta}`;
                result = `${money_value}:\n  Compra: ${data.Compra}\n  Venta:     ${data.Venta}`
              }
              else {
                data.Compra === "No Cotiza" ? data.Compra : data.Compra = `$ ${data.Compra}`;
                data.Venta === "No Cotiza" ? data.Venta : data.Venta = `$ ${data.Venta}`;
                result = `${money_value}:\n  Compra: ${data.Compra}\n  Venta:     ${data.Venta}`
              }
            } else {
              const quantity = money[1];
              if (money_value === "Riesgo Pais Argentina") {
                result = `El ${money_value} es de ${data.Compra}`
              } else if (money_value === "Bitcoin") {
                compra_a_pesos = parseFloat(data.Compra) * parseFloat(quantity);
                compra_con_pesos = parseFloat(quantity) / parseFloat(data.Compra);
                result = `${quantity} ${money_value} son iguales a ${data.Compra * quantity} Dolares Americanos (Oficiales).\n\
                ${quantity} Dolares Americanos (Oficiales) son iguales a ${quantity / data.Compra} ${money_value}.`
              }
              else {
                compra_a_pesos = parseFloat(data.Compra) * parseFloat(quantity);
                compra_con_pesos = parseFloat(quantity) / parseFloat(data.Compra);
                result = `${quantity} Pesos Argentinos son iguales a ${compra_con_pesos} ${money_value}.\
                ${quantity} ${money_value} son iguales a ${compra_a_pesos} Pesos Argentinos.`
              }
            }
            resolve(result);
          } else {
            reject(`No se encuentra disponible la cotización de ${money_value}`);
          };
        });
      };
    } else {
      reject(`No se reconocio el comando '${money}'.\n${help_message}`);
    }
  });
};


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
exports.get_price = get_price;
exports.command_get_price = command_get_price;
exports.help_message = help_message;
