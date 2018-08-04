
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
            fnCell(getCell(cells, x,y), x , y);
        }
    }
}

printCells = (cells) => {
    let s= "";
    forEachCell(cells, (c) => s += " " + c, () => s += "\n");  

    console.log(s);
}

interate = (cells) => {
}

let cells = [];

setCell(cells, 10,10,1);
setCell(cells,11,10,1);
setCell(cells,10,11,1);
setCell(cells,12,11,1);
console.log(getCell(cells,12,11));

printCells(cells);

for (let i = 0; i<10; i++) {
    interate(cells)
    printCells(cells);
}
    