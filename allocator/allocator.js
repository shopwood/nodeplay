
console.log("testing");
class GlobalSettings {
    constructor() {
        this.serverCount = 5;
        this.tenants = 5;
        this.threadsPerServer = 10;
        this.costPerUnderThread = -0.5;
        this.costPerOverThread = -0.25;
        this.costPerUnderTenantServerAlloc = -1;
        this.costPerOverTenantServerAlloc = -1;
        this.costEmptyServer = 0.75;
    }
}

class Server {
    constructor(globalSettings) {
        this.globalSettings = globalSettings;
        this.tenantThreads = [];
        for (let i = 0; i<globalSettings.tenants; i++) {
            this.tenantThreads[i] = 0;
        }
    }

    fitness() {
        let totalThreads = 0;
        this.tenantThreads.forEach(element => totalThreads += element);


        if (totalThreads == 0) {
            return this.globalSettings.costEmptyServer;
        } else if (totalThreads < this.globalSettings.threadsPerServer) {
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
    for (let tenantId=0; tenantId < globalSettings.tenants; tenantId++) {
        let count = 0;
        servers.forEach(server => {
            if (server.tenantThreads[tenantId] > 0) {
                count++;
            }
        });

        if (count < 2) {
            result += (2 - count) * globalSettings.costPerUnderTenantServerAlloc;
        } else if (count > 2) {
            result += (count - 2) * globalSettings.costPerOverTenantServerAlloc;
        }
    }
    return result;
}

function randomAdjustServers(globalSettings, servers) {
    let selectedTenant = Math.floor(Math.random() * 1000) % settings.tenants;
    let selectedServer = Math.floor(Math.random() * 1000) % settings.serverCount;
    /*let adjust = Math.floor(Math.random() * 1000) % 5 - 2;

    var current = servers[selectedServer].tenantThreads[selectedTenant];
    var adjusted = current + adjust;
    if (adjusted > 0) {
        servers[selectedServer].tenantThreads[selectedTenant] = adjusted;
    }
    */
   servers[selectedServer].tenantThreads[selectedTenant] = Math.floor(Math.random() * 1000 % (settings.threadsPerServer + 1));
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
for (let i=0; i<settings.serverCount; i++) {
    servers[i] = new Server(settings);
}


let fitness = -10000.0;


console.log(serverFitness(servers));
console.log(tenantFitness(settings, servers));

printServers(servers);
console.log("Fitness: ", fitness);    

let i = 0;
for ( i = 0; i<100000; i++) {
    let newServers = cloneServers(servers);

    for (let j = 0; j<10; j++) {
        randomAdjustServers(settings, newServers);
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
