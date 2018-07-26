
console.log("testing");
class GlobalSettings {
    constructor() {
        this.threadsPerServer = 10;
        this.costPerUnderThread = -0.25;
        this.costPerOverThread = -0.5;
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

        if (totalThreads < this.expectedThreads) {
            return (this.globalSettings.threadsPerServer - totalThreads) * this.globalSettings.costPerUnderThread;
        } else {
            return (this.totalThreads- this.globalSettings.threadsPerServer) * this.globalSettings.costPerOverThread;
        }
    }
}

var settings = new GlobalSettings();
var server = new Server(settings);
console.log(server.fitness());