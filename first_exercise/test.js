const os = require('os');
const fs = require('fs');

let cpu = os.cpus();
let system = os.platform();
let user = os.hostname();
// console.log('cpu: ', cpu);
// console.log('system: ', system);
// console.log('user: ', user);

fs.appendFile('algo.txt', `System info: ${JSON.stringify(cpu)}`, function(error) {
    if(error) {
        console.log('Error al crear archivo');
    }
});