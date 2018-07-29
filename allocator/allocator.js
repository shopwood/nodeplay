
console.log("testing");
class GlobalSettings {
    constructor() {
        this.threadsPerServer = 10;
        this.costPerUnderThread = 0;//-0.25;
        this.costPerOverThread = 0;//-0.5;
        this.costPerUnderTenantServerAlloc = 0;//-5;
        this.costPerOverTenantServerAlloc = -1;
    }
}

class Server {
    constructor(globalSettings) {
        this.globalSettings = globalSettings;
        this.tenantThreads = [0,0,0,0,0];
    }

    fitness() {
        let totalThreads = 0;
        this.tenantThreads.forEach(element => totalThreads += element);


        if (totalThreads < this.globalSettings.threadsPerServer) {
            return (this.globalSettings.threadsPerServer - totalThreads) * this.globalSettings.costPerUnderThread;
        } else {
            return (totalThreads - this.globalSettings.threadsPerServer) * this.globalSettings.costPerOverThread;
        }
    }

    print() {
        var message = "";
        this.tenantThreads.forEach(tenant => {
            message += " " + tenant;
        })
        console.log(message)
    }

    clone() {
        let result = new Server(this.globalSettings);
        result.tenantThreads = this.tenantThreads.slice(0);
        return result;
    }
}


function serverFitness(servers) {
    let result = 0;
    servers.forEach(server => {
        result += server.fitness();
    });

    return result;
}

function printServers(servers) {
    console.log("--------");
    servers.forEach(s => {
        s.print();
    })
}
function tenantFitness(globalSettings, servers) {
    let result = 0;
    for (let tenantId=0; tenantId<5; tenantId++) {
        let count = 0;
        servers.forEach(server => {
            if (server[tenantId] >= 0)
                count++;
        });

        if (count < 2) {
            result += (2 - count) * globalSettings.costPerUnderTenantServerAlloc;
        } else {
            result += (count - 2) * globalSettings.costPerOverTenantServerAlloc;
        }
    }
    return result;
}

function randomAdjustServers(servers) {
    let selectedTenant = Math.floor(Math.random() * 1000) % 5;
    let selectedServer = Math.floor(Math.random() * 1000) % 4;
    let adjust = Math.floor(Math.random() * 1000) % 5 - 2;

    var current = servers[selectedServer].tenantThreads[selectedTenant];
    var adjusted = current + adjust;
    if (adjusted > 0) {
        servers[selectedServer].tenantThreads[selectedTenant] = adjusted;
    }
}

function cloneServers(servers) {
    let result = [];
    servers.forEach(server => {
        result.push(server.clone());
    });
    return result;
}

function totalFitness(servers) {
    return serverFitness(servers) + tenantFitness(settings, servers);
}


var settings = new GlobalSettings();

var servers = [];
for (let i=0; i<4; i++) {
    servers[i] = new Server(settings);
}


let fitness = -10000.0;


console.log(serverFitness(servers));
console.log(tenantFitness(settings, servers));

printServers(servers);
console.log("Fitness: ", fitness);    

let i = 0;
for ( i = 0; i<10000; i++) {
    let newServers = cloneServers(servers);

    for (let j = 0; j<10; j++) {
        randomAdjustServers(newServers);
    }

    let newFitness = totalFitness(newServers);

    if (newFitness > fitness) {
        console.log("Fitness improved by: "  + (newFitness - fitness) );
        fitness = newFitness;
        servers = newServers;

        printServers(newServers);
        console.log("Generation: " + i + ", Fitness: ", fitness);    
    }

    
}

console.log("Generation: " + i + ", Fitness: ", fitness);    
