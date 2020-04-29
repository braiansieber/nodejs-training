/* 
Generar un módulo con Node.js que integre los conceptos que aprendimos en el curso hasta la fecha.
El caso más sencillo y comúnmente utilizado suele ser un conversor de moneda que 
recibe un parámetro en una moneda especifica y hace la correspondiente conversión.
Con este práctico, buscamos que aprendan cómo es el proceso 
completo de desarrollo y publicación de un módulo en npm.
Dicha solución debería de englobar los siguientes conceptos teóricos
* Promesas
* Modularización de código
* Módulos del core de Node.js
* Asincronismo
* Manejo de errores
* Manejo del CLI de npm con comandos básicos
Si tienen otra idea para implementar y lo ven suficientemente factible, es bienvenido.
Recuerden que no es una tarea formal y no implica ninguna nota. ¡El límite está en ustedes!. 
*/
const get_values_dolarsi = require('./get_values_dolarsi')

const url_varios = get_values_dolarsi.URLs.varios;
const get_value = get_values_dolarsi.get_value;
const get_table = get_values_dolarsi.get_table;
let contents_values = [];

get_table().then(data => {
    console.log('tabla con get_table()');
    console.table(data);
});

(async function() {
    valores = await get_value(url_varios);
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
    console.log('tabla en async function():');
    console.table(contents_values);

    const valu_todo = await get_table();
    console.log('vale: ', valu_todo);
    
})();


// console.log(get_values_dolarsi.get_value(get_values_dolarsi.URLs))
