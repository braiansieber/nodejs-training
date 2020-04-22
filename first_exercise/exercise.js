/* Generar un script en JavaScript haciendo uso de Node que manipule un archivo local que puede ser un txt u
 otro formato que deseen y me brinde un listado por consola de las transacciones que no fueron exitosas.
El formato del archivo de texto puede ser generado por otro software de la siguiente forma
ID | DATE | TIME | STATUS
0000-0000:YYYYMMDD:HHMM:XX
Ejemplo:
ID | DATE | TIME | STATUS
0000-0001:20200415:1800:OK
0000-0002:20200415:2000:RJ
0000-0003:20200415:2030:CD
Donde STATUS puede tener los siguientes valores:
* Transacción aprobada (OK)
* Transacción rechazada (RJ)
* Transacción cancelada (CD)
Ejemplo:
>node myScript.js
Transactions
—————————————————————————
0000-0002
0000-0003
Dificultad: Fácil
Escenario:
* Se nos solicita generar un script que se ejecute automáticamente al final del día y que 
  sirva para detallar al sector de contabilidad las transacciones que no fueron exitosas.
Objetivo de esta tarea:
* Tener configurado correctamente en nuestro entorno local Node.js
* Conocer y explorar la documentación oficial de Node.js
* Manipulación de archivos con Node.js
* Demostrar conocimientos del uso de operadores lógicos condicionales 
*/

const fs = require('fs');

// fs.appendFile('algo.txt', `System info: ${JSON.stringify(cpu)}`, function(error) {
//     if(error) {
//         console.log('Error al crear archivo');
//     }
// });

let contents = fs.readFileSync('transaccions', 'utf8');
let contents_split = contents.split('\n');
contents_split.shift();


let contents_reject = [];
const not_reject = ['OK'];

contents_split.forEach(element => {
  element.includes(not_reject) ? true : contents_reject.push(element);
});

console.table(contents_reject2);
