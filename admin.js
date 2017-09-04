var root2 = Math.sqrt(2);
var insideTables = Array();
var outsideTables = Array();

var tablesize=40;
var seatsize=6;
var gapsize=10;

var selected = 0;
var room = 0; // 0 inside, 1 outside

function initData() {
    // Construct table arrays
    insideTables[1] = {type:"r2", x:0, y:350};
    insideTables[2] = {type:"r4", x:0, y:280};
    insideTables[3] = {type:"r2", x:0, y:220};
    insideTables[4] = {type:"r2", x:120, y:350};
    insideTables[5] = {type:"r4", x:120, y:280};
    insideTables[6] = {type:"r6", x:0, y:140};
    insideTables[7] = {type:"c4", x:120, y:200};
    insideTables[8] = {type:"r2", x:120, y:140};
    insideTables[9] = {type:"r4", x:160, y:70};
    insideTables[10] = {type:"c4", x:0, y:70};
    insideTables[11] = {type:"r2", x:0, y:0};
    insideTables[12] = {type:"r2", x:80, y:0};
    insideTables[13] = {type:"r4", x:160, y:0};
    insideTables[14] = {type:"r2", x:240, y:0};
    insideTables[15] = {type:"r4", x:320, y:0};
    insideTables[16] = {type:"r2", x:400, y:0};
    insideTables[17] = {type:"c4", x:400, y:70};
    insideTables[18] = {type:"r4", x:320, y:70};
    insideTables[19] = {type:"r2", x:280, y:170};
    insideTables[20] = {type:"r4", x:0, y:410};
    insideTables[21] = {type:"r4", x:180, y:410};
    insideTables[22] = {type:"r4", x:240, y:410};
    insideTables[23] = {type:"r4", x:330, y:410};
    insideTables[24] = {type:"r4", x:300, y:350};

    outsideTables[1] = {type:"r4",x:0,y:300};
    outsideTables[2] = {type:"r4", x:0, y:240};
    outsideTables[3] = {type:"r4", x:60, y:240};
    outsideTables[4] = {type:"r4", x:60, y:300};
    outsideTables[5] = {type:"c4", x:0, y:120};
    outsideTables[6] = {type:"c4", x:0, y:0};
    outsideTables[7] = {type:"c4", x:60, y:0};
    outsideTables[8] = {type:"c4", x:60, y:120};
    outsideTables[9] = {type:"r4", x:120, y:0};
    outsideTables[10] = {type:"r4", x:120, y:60};
    outsideTables[11] = {type:"r4", x:120, y:120};

    outsideTables[12] = {type:"r4", x:120, y:180};
    outsideTables[13] = {type:"r4", x:120, y:240};
    outsideTables[14] = {type:"c4", x:120, y:300};

    var tableid=1;
    for (var j = 1; j < insideTables.length; j++, tableid++){
        insideTables[j].width = 60;
        insideTables[j].height = 60;
        insideTables[j].count = j;
        insideTables[j].id = String(tableid);
        insideTables[j].comment = "";
        if (insideTables[j].type == "r4") insideTables[j].height = 70;
        else if (insideTables[j].type == "r6") insideTables[j].height = 80;
        else if (insideTables[j].type == "R4") insideTables[j].width = 70;
        else if (insideTables[j].type == "R6") insideTables[j].width = 80;
    }

    for (var j = 1; j < outsideTables.length; j++, tableid++){
        outsideTables[j].width = 60;
        outsideTables[j].height = 60;
        outsideTables[j].count = j;
        if (tableid == 25) tableid=30;
        else if (tableid == 34) tableid=40;
        else if (tableid == 44) tableid=50;
        outsideTables[j].id = String(tableid);
        outsideTables[j].comment = "";
        if (outsideTables[j].type == "r4") outsideTables[j].height = 70;
        else if (outsideTables[j].type == "r6") outsideTables[j].height = 80;
        else if (outsideTables[j].type == "R4") outsideTables[j].width = 70;
        else if (outsideTables[j].type == "R6") outsideTables[j].width = 80;
    }
}
function addKey(ctx, x, y) {
    ctx.font = "14px Arial";
    var offset=(item.width)/2-4*item.id.length;
    ctx.fillText(item.id, item.x+offset, item.y+item.height/2 + 5);

}
function label(ctx, item) {
    ctx.font = "14px Arial";
    var offset=(item.width)/2-4*item.id.length;
    ctx.fillText(item.id, item.x+offset, item.y+item.height/2 + 5);
}
function drawVSeats(ctx, x, y) {
    ctx.rect(x-seatsize, y, seatsize, seatsize);
    ctx.rect(x+tablesize, y, seatsize, seatsize);
}

function drawHSeats(ctx, x, y) {
    ctx.rect(x, y-seatsize, seatsize, seatsize);
    ctx.rect(x, y+tablesize, seatsize, seatsize);
}

function rect(ctx, item, seats, orientation) {
    var x = item.x + gapsize;
    var y = item.y + gapsize;
    var width = tablesize;
    var height = tablesize;
    if (orientation == 'h') {
        width += 10 * (seats/2);
        ctx.rect(x, y, width, height);
        for (var row=0; row < seats/2; ++row) {
            ctx.rect(x+(width-seatsize)/2, y-seatsize, seatsize, seatsize);
            ctx.rect(x+(width-seatsize)/2, y+height, seatsize, seatsize);

        }
    }
    else {
        height += 10 * (seats/2);
        ctx.rect(x, y, width, height);
        var offset = (seats>4)?15:20;
        var start = y + (height - seatsize) / 2;
        switch(seats) {
            case 2:
                offset=0;
                start=y + (height - seatsize) / 2;
                break;
            case 4:
                offset=0;
                start=y + (height - seatsize) / 2;
            case 6:
                offset=0;
                start=y + (height - seatsize) / 2;
                - (seats>4)?15:10;10 * (seats/2 - 1);
                for (var row=0; row < seats/2; ++row) {
                    ctx.rect(x - seatsize, y + (height - seatsize) / 2, seatsize, seatsize);
                    ctx.rect(x + width, y + (height - seatsize) / 2, seatsize, seatsize);
                }
        }
    }
    ctx.stroke();
    label(ctx, item);
}
/*
 if (item.comment != "") {
 ctx.fillStyle="#ff95bf";
 ctx.fillRect(x,y, tablesize, tablesize);
 ctx.fillStyle="#000000";
 }
 else {
 ctx.rect(x, y, tablesize, height);
 }
 */
function drawV(ctx, item, seats) {
    var x = item.x + gapsize;
    var y = item.y + gapsize;
    var height = item.height-20;
    ctx.rect(x, y, tablesize, height);
    y += (height-seatsize)/2;
    switch(seats) {
        case 2:
            drawVSeats(ctx, x, y);
            break;
        case 4:
            drawVSeats(ctx, x, y-10);
            drawVSeats(ctx, x, y+10);
            break;
        case 6:
            drawVSeats(ctx, x, y-15);
            drawVSeats(ctx, x, y);
            drawVSeats(ctx, x, y+15);
            break;
    }
    ctx.stroke();
    label(ctx, item);
}
function drawH(ctx, item, seats) {
    var x = item.x + gapsize;
    var y = item.y + gapsize;
    var width = item.width-20;
    ctx.rect(x, y, width, tablesize);
    x += (width-seatsize)/2;
    switch(seats) {
        case 2:
            drawHSeats(ctx, x, y);
            break;
        case 4:
            drawHSeats(ctx, x-10, y);
            drawHSeats(ctx, x+10, y);
            break;
        case 6:
            drawHSeats(ctx, x-15, y);
            drawHSeats(ctx, x, y);
            drawHSeats(ctx, x+15, y);
            break;
    }
    ctx.stroke();
    label(ctx, item);
}
function drawSeatAngle(ctx, x, y) {
    var offset = seatsize / root2;
    ctx.moveTo(x, y);
    ctx.lineTo(x+offset, y+offset);
    ctx.lineTo(x+offset+offset, y);
    ctx.lineTo(x+offset, y-offset);
    ctx.lineTo(x, y);
    ctx.stroke();
}

function circle(ctx, item, seats) {
    var x = item.x + gapsize;
    var y = item.y + gapsize;
    var radius = tablesize/2;
    var xcentre = x+radius;
    var ycentre = y+radius;
    ctx.beginPath();
    ctx.arc(xcentre,ycentre,radius,0,2*Math.PI);
    drawVSeats(ctx, x, y+radius-seatsize/2);
    drawHSeats(ctx, x+radius-seatsize/2, y);
    ctx.stroke();
    if (seats > 4) {
        var offsetplus = (tablesize+seatsize)/(2*root2);
        var offsetminus = (tablesize-seatsize)/(2*root2);
        switch(seats) {
            case 8:
                drawSeatAngle(ctx, xcentre - offsetminus - seatsize*root2, ycentre+offsetplus);
            case 7:
                drawSeatAngle(ctx, xcentre - offsetminus - seatsize*root2, ycentre-offsetplus);
            case 6:
                drawSeatAngle(ctx, xcentre + offsetminus, ycentre+offsetplus);
            case 5:
                drawSeatAngle(ctx, xcentre + offsetminus, ycentre-offsetplus);
        }
    }
    label(ctx, item);
}

function render() {
    var ctx = document.getElementById('floorplan').getContext('2d');
    ctx.beginPath();
    ctx.clearRect(0,0,500,500);
    var tables = (room==0)?insideTables:outsideTables;
    tables.forEach(function (item) {
        if (item.type == "r2") drawV(ctx, item, 2);
        else if (item.type == "r4") drawV(ctx, item, 4);
        else if (item.type == "r6") drawV(ctx, item, 6);
        else if (item.type == "R2") drawH(ctx, item, 2);
        else if (item.type == "R4") drawH(ctx, item, 4);
        else if (item.type == "R6") drawH(ctx, item, 6);
        else if (item.type == "c4") circle(ctx, item, 4);
        else if (item.type == "c5") circle(ctx, item, 5);
        else if (item.type == "c6") circle(ctx, item, 6);
        else if (item.type == "c7") circle(ctx, item, 7);
        else if (item.type == "c8") circle(ctx, item, 8);
        if (selected == item.count) {
            ctx.rect(item.x, item.y, item.width, item.height);
            ctx.stroke();

        }
    });
}
function inside() {
    room=0;
    selected=0;
    render();
}
function outside() {
    room=1;
    selected=0;
    render();
}

function addCanvasEvents() {
    var canvas = document.getElementById('floorplan');

    //fixes a problem where double clicking causes text to get selected on the canvas
    canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
    canvas.addEventListener('mousedown', function(e) {
        var parentOffset = $(this).offset();

        var mx=parseInt(e.pageX - parentOffset.left);
        var my=parseInt(e.pageY - parentOffset.top);
//        document.getElementById("xypage").innerHTML = "Page: " + e.pageX + "," + e.pageY;
//        document.getElementById("xyclient").innerHTML = "Client: " + e.clientX + "," + e.clientY;
//        document.getElementById("xyscreen").innerHTML = "Screen: " + e.screenX + "," + e.screenY;
//        document.getElementById("xyparent").innerHTML = "Parent: " + parentOffset.left + "," + parentOffset.top;

        selected = 0;
        var tables = (room==0)?insideTables:outsideTables;

        tables.forEach(function (item) {
            if ((mx > item.x) && (my > item.y) && (mx < item.x + item.width) && (my < item.y + item.height)) {
                selected = item.count;
            }
        });
        render();
//        console.log("Mousedown at " + mx + ", " + my+ ", selected = " + selected);
    }, true);
}

