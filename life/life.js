
getCell = (cells, x, y) => {
    let row = cells[x];
    if (!row)
        return 0;
    
    let cell = row[y];
    return !cell ? 0 : cell;
};

setCell = (cells, x,y,z) => {
    var row = cells[x];

    if (!row) {
        if (!z) 
            return;

        row = [];
        cells[x] = row;
    }

    row[y] = z; 
};

forEachCell = (cells, fnCell, fnRow) => {
    for (let x = 0; x < 20; x++) {
        if (fnRow)
            fnRow(x);

        for (let y = 0; y<20; y++) {
            fnCell(x,y);
        }
    }
};

printCells = (cells) => {
    let s= "";
    forEachCell(cells, (x,y) => s += " " + getCell(cells, x, y), () => s += "\n");  

    console.log(s);
};

liveNeighbours = (cells, x, y) => {
    let c = 0;
    forNeighbours(x,y, (x,y) => c += getCell(cells, x, y));
    return c;
};

forNeighbours = (x, y, fn) => {
        fn(x-1,y-1);
        fn(x, y-1);
        fn(x+1, y-1);
        fn(x-1,y);
        fn(x+1, y);
        fn(x-1,y+1);
        fn(x, y+1);
        fn(x+1, y+1);
};

interate = (cells) => {
    var update = [];
    forEachCell(cells, (x,y) => {
        let v = getCell(cells, x, y);
        let n = liveNeighbours(cells, x,y);

        var newV = nextV(v, n);

        if (v != newV) {
            update.push(() => setCell(cells,x,y,newV));
        }
     });

     update.map(m => m())
};

iterate2 = (cells, updates) => {
    let newUpdates = [];
    updates.forEach(update => {
        let {x,y,v} = update;
        setCell(cells, x, y, v);
        check(cells, x, y, updates);
        forNeighbours(x, y, (x,y) => check(cells, x, y, newUpdates));
    });
    return newUpdates;
};

check = (cells, x, y, updates) => {
    let v = getCell(cells, x, y);
    let n = liveNeighbours(cells, x, y);
    var newV = nextV(v, n);

    if (v != newV) {
        updates.push({x, y, v});
    }
} 

nextV = (v, n) => {
    if (v) {
        return n == 2 || n == 3 ? 1 : 0
    } else {
        return n == 3 ? 1 : 0;
    }
};


let cells = [];


//setCell(cells, 10,10,1);
//setCell(cells,11,10,1);
//setCell(cells,10,11,1);
//setCell(cells,12,11,1);
//console.log(getCell(cells,12,11));

printCells(cells);

let updates = [];
forEachCell(cells, (x,y) => {
    if (Math.random() > 0.4)
        updates.push({x,y,v:1}); 
});

for (let i = 0; i<100; i++) {
    updates = iterate2(cells, updates);
    printCells(cells);
}
    