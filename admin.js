var root2 = Math.sqrt(2);
var insideTables = [];
var outsideTables = [];

var tablesize=40;
var seatsize=6;
var gapsize=10;

var selected = 0;
var room = 0; // 0 inside, 1 outside

var day_bookings = [];
var table_bookings = []
var colour_comment = "#ff95bf";
var colour_booking = "#24c12e";
var colour_empty = "#bebebe";
var colour_unavailable = "#be98a1";

var excluded_days = [];

var hours = [];

var times = [];

function setColour(tables) {
    tables.forEach(function (table) {
        table.colour = colour_empty;
        if (table.id in table_bookings)
        {
            table_bookings[table.id].forEach(function(booking) {
                if (booking.comment !== "") {
                    table.colour = colour_comment;
                }
                else if (table.colour === colour_empty) {
                    table.colour = colour_booking;
                }
            });
        }
    });

}

function parseResponse(msg) {
    var tmp = JSON.parse(msg);
    day_bookings = [];
    table_bookings = [];
    tmp.bookings.forEach(function(item) {
        day_bookings[item.ID] = item;
    });
    tmp.tables.forEach(function(item) {
        var table = parseInt(item.TableNo_Slot.slice(0,2));
        var slot = parseInt(item.TableNo_Slot.slice(3,5));
        console.log(item.TableNo_Slot + " => " + item.TableNo_Slot.slice(0,2) + " : " + item.TableNo_Slot.slice(3,5))
        var id = item.Booking_Ref;
        var booking = day_bookings[id];
        console.log("Adding entry for table " + table + " at " + slot + ":" + times[slot]);
        if (!(item.table in table_bookings)) {
            table_bookings[table] = [];
        }
        var entry = { table:table, time:slot, comment:"test", size:booking.Size, name:"Me", email:booking.Email};

        table_bookings[table][slot] = entry;
    });

    setColour(insideTables);
    setColour(outsideTables);

}

function applyBookings() {
    var date = new Date(document.getElementById("datepicker").value);

    hours = [0];

    if (date.getDay() === 0) {
        // Sunday
        hours.push(38);
    }
    else if (date.getDay() === 6) {
        // Saturday
        hours.push(42);
    }
    else {
        // Weekday
        hours.push(10);
        hours.push(24);
        hours.push(42);
    }


    console.log("Loading bookings for " + date + " - day " + date.getDay());
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        console.log("Status: " + this.status);
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            var response = JSON.parse(this.responseText);
            parseResponse(this.responseText);
        }
        inside();
    };
    xhttp.open("GET", "https://msjhgasjyb.execute-api.eu-west-2.amazonaws.com/beta/demo/website?Date=2017-08-27", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.send();


    /*
     var msg = '{"bookings":[{"id":549, "name":"Alex Vanlint","email":"m0011369@gmail.com", "size":3, "time":"12:15", "comment":"Multi-tables 15 & 18"},\
     {"id":389, "name":"Paul Vanlint","email":"paul@polyzing.com", "size":3, "time":"12:00"},\
     {"id":479, "name":"Sparky Vanlint","email":"sparky@polyzing.com", "size":3, "time":"12:00"}],\
     "tables":[{"id":389,"table":"05-00"},\
     {"id":479,"table":"06-00"},\
     {"id":549,"table":"07-01"}]}';
     */


    var msg = '{\
    "bookings": [\
        {\
            "Date": "2017-08-27",\
            "Time": "12:15",\
            "ID": 549,\
            "Email": "m0011369@gmail.com",\
            "Size": 3\
        },\
        {\
            "Date": "2017-08-27",\
            "Time": "12:00",\
            "ID": 389,\
            "Email": "m0011369@gmail.com",\
            "Size": 3\
        },\
        {\
            "Date": "2017-08-27",\
            "Time": "12:00",\
            "ID": 479,\
            "Email": "m0011369@gmail.com",\
            "Size": 3\
        }\
    ],\
        "tables": [\
        {\
            "Booking_Ref": 389,\
            "Date": "2017-08-27",\
            "TableNo_Slot": "05-00",\
            "Size": 4\
        },\
        {\
            "Booking_Ref": 479,\
            "Date": "2017-08-27",\
            "TableNo_Slot": "06-00",\
            "Size": 4\
        },\
        {\
            "Booking_Ref": 549,\
            "Date": "2017-08-27",\
            "TableNo_Slot": "07-01",\
            "Size": 6\
        }\
    ]\
}';

    //parseResponse(msg);
    /*
    day_bookings = [
        {table:3,time:22,comment:"Book table 1",size:2,name:"Paul Vanlint", email:"paul@polyzing.com"},
        {table:52,time:24,comment:"",size:2,name:"John Smith", email:"paul@polyzing.com"},
        {table:4,time:26,comment:"",size:2,name:"Lizzy Vanlint", email:"paul@polyzing.com"},
        {table:6,time:26,comment:"Really big comment, can we have it wrap? Perhaps it might be too big, when specified as a single sentence.",size:2,name:"Ringo Smith", email:"paul@polyzing.com"},
        {table:15,time:26,comment:"Multi-tables 15 & 18",size:8,name:"Sparky Vanlint", email:"paul@polyzing.com"},
        {table:18,time:26,comment:"Multi-tables 15 & 18",size:8,name:"Sparky Vanlint", email:"paul@polyzing.com"},
        {table:3,time:30,comment:"Book table 1",size:2,name:"Alex Vanlint", email:"paul@polyzing.com"},
        {table:52,time:32,comment:"",size:2,name:"Paul Smith", email:"paul@polyzing.com"},
        {table:7,time:34,comment:"",size:2,name:"Brian Epstein", email:"paul@polyzing.com"},
        {table:4,time:34,comment:"Book table 1",size:2,name:"Tamara Vanlint", email:"paul@polyzing.com"},
        {table:3,time:40,comment:"",size:2,name:"William Vanlint", email:"paul@polyzing.com"},
        {table:52,time:40,comment:"",size:2,name:"George Smith", email:"paul@polyzing.com"}
    ];

    table_bookings = [];
    day_bookings.forEach(function(item) {
        console.log("Adding entry for table " + item.table + " at " + times[item.time]);
        if (!(item.table in table_bookings)) {
            table_bookings[item.table] = [];
        }

        table_bookings[item.table][item.time] = item;
    });

    table_bookings.forEach(function(item) {
        item.forEach(function (entry) {
            console.log( entry.table + ", " + entry.time);
        });
    });
*/
}

function showDetail(time) {
    var detail="";
    if (selected in table_bookings) {
        if (time in table_bookings[selected]) {
            var item = table_bookings[selected][time];
            detail = "<table><tr height='10'></tr><tr><td>Name</td><td>" + item.name +
                "</td></tr><tr><td>Email</td><td>" + item.email +
                "</td></tr><tr><td>Party Size</td><td>" + item.size +
                "</td></tr><tr><td>Table</td><td>" + item.table +
                "</td></tr><tr><td>Comment</td><td>" + item.comment +
                "</td></tr><tr><td>Time</td><td>" + item.time + "</td></tr></table>";

            console.log("Showing entry for " + times[time]);
            console.log(item);
        }
    }
    document.getElementById("booking_detail").innerHTML = detail;
}

function bookAdmin(time, warn) {
    document.getElementById("booking_detail").innerHTML = "";
    if (warn && !confirm("Note that " + time + " is too close to a later booking. Do you want to proceed anyway and book up to the next seating?")) {
        return;
    }
    console.log("Book for " + time);
}

function isToday() {
    var now = new Date();
    var nowtime;
    if (now.getHours() < 2) {
        // Up to 2am, now counts as end of previous day
        nowtime = now.setHours(0,0,0,0);
        nowtime -= 86400000;
    }
    else {
        nowtime = now.setHours(0,0,0,0);
    }

    if (date.getTime() === nowtime) {
        if (current_timeslot > next_timeslot) {
            next_timeslot = current_timeslot;
        }
    }
    else {
        current_timeslot = 0;
    }

}

function renderTableBookings(bookings) {
    console.log("renderTableBookings for " + bookings.length);
    var text = "";
    var colour;
    var timestr = "";
    var next_timeslot = hours[0];
    var last_timeslot = hours[1];
    var current_timeslot = 0;
    var date = new Date(document.getElementById("datepicker").value);
    var now = new Date();
    var nowtime;
    if (now.getHours() < 2) {
        // Up to 2am, now counts as end of previous day
        current_timeslot=36;
        nowtime = now.setHours(0,0,0,0);
        nowtime -= 86400000;
    }
    else {
        current_timeslot=(now.getHours() - 12) * 4 + Math.floor(now.getMinutes()/15) - 1;
        if (current_timeslot > 36) {
            current_timeslot = 36;
        }
        nowtime = now.setHours(0,0,0,0);
    }
    if (date.getTime() === nowtime) {
        if (current_timeslot > next_timeslot) {
            next_timeslot = current_timeslot;
        }
    }
    else {
        current_timeslot = 0;
    }

    bookings.forEach(function(item) {
        if (item.time + 6 > current_timeslot) {
            // Next item is still viewable
            // Check hours.length and last_timeslot, to allow potential late booking
            if ((item.time > last_timeslot) && (hours.length === 4) && (last_timeslot !== hours[3])) {
                // Next item is in next sitting
                if (current_timeslot <= last_timeslot) {
                    // And slots at end of previous sitting are still viewable
                    while (next_timeslot <= last_timeslot) {
                        text += "<tr onmousedown='bookAdmin(\"" + times[next_timeslot] + "\",0)' style='background-color: " + colour_empty + ";'><td>" + times[next_timeslot] + "</td><td>Empty</td></tr>";
                        next_timeslot++;
                    }
                    text += "<tr style='background-color: white; height: 10px;'><td></td><td></td></tr>";
                    next_timeslot = hours[2];
                    last_timeslot = hours[3];
                }
                else {
                    next_timeslot = hours[2];
                    last_timeslot = hours[3];
                    if (current_timeslot > next_timeslot) {
                        next_timeslot = current_timeslot;
                    }
                }
            }
            while (next_timeslot < item.time-5) {
                text += "<tr onmousedown='bookAdmin(\"" + times[next_timeslot] + "\",0)' style='background-color: " + colour_empty + ";'><td>" + times[next_timeslot] + "</td><td>Empty</td></tr>";
                next_timeslot++;
            }
            while (next_timeslot < item.time) {
                text += "<tr onmousedown='bookAdmin(\"" + times[next_timeslot] + "\",1)' style='background-color: " + colour_unavailable + ";'><td>" + times[next_timeslot] + "</td><td>Unavailable</td></tr>";
                next_timeslot++;
            }
            if (item.time in times) {
                timestr = times[item.time];
            }
            else {
                timestr = "?";
            }
            if (item.comment === "") {
                text += "<tr onmousedown='showDetail(" + item.time + ")' style='background-color: " + colour_booking + ";'><td>" +
                    timestr + "</td><td>" + item.name + "</td></tr>";
            }
            else {
                text += "<tr class='tooltip' onmousedown='showDetail(" + item.time + ")' style='background-color: " + colour_comment + ";'><td>" +
                    timestr + "<span class='tooltiptext'>" + item.comment + "</span></td><td>" + item.name + "</td></tr>";
            }
            next_timeslot+=6;

        }
    });
    if (current_timeslot <= last_timeslot) {
        while (next_timeslot <= last_timeslot) {
            text += "<tr onmousedown='bookAdmin(\"" + times[next_timeslot] + "\",0)' style='background-color: " + colour_empty + ";'><td>" + times[next_timeslot] + "</td><td>Empty</td></tr>";
            next_timeslot++;
        }
        if ((hours.length === 4) && (last_timeslot !== hours[3])) {
            // Switch from lunch to dinner
            text += "<tr style='background-color: white; height: 10px;'><td></td><td></td></tr>";
            next_timeslot = hours[2];
            last_timeslot = hours[3];
        }
    }
    else if ((hours.length === 4) && (last_timeslot !== hours[3])) {
        // Switch from lunch to dinner
        next_timeslot = hours[2];
        last_timeslot = hours[3];
        if (current_timeslot > next_timeslot) {
            next_timeslot = current_timeslot;
        }
    }
    while (next_timeslot <= last_timeslot) {
        text += "<tr onmousedown='bookAdmin(\"" + times[next_timeslot] + "\",0)' style='background-color: " + colour_empty + ";'><td>" + times[next_timeslot] + "</td><td>Empty</td></tr>";
        next_timeslot++;
    }
    document.getElementById("table_bookings").innerHTML = "<table class='details'><tr><th>Time</th><th>Name</th></tr><tr id='container'></tr>" + text + "</table>";
    document.getElementById("booking_detail").innerHTML = "";

}

var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var tr1 = document.createElement("TR");
            document.getElementById("Table1").appendChild(tr1);
            var td = document.createElement("TD");
            tr1.appendChild(td);
            var table = document.createElement("TABLE");
            table.setAttribute("class", "table2");
            td.appendChild(table);
            tr1 = document.createElement("TR");
            tr1.setAttribute("class", "row");
            table.appendChild(tr1);
            var th = document.createElement("TH");
            tr1.appendChild(th);
            var text = document.createTextNode("Time");
            th.appendChild(text);
            th = document.createElement("TH");
            tr1.appendChild(th);
            text = document.createTextNode("Detail");
            th.appendChild(text);
            tr1 = document.createElement("TR");
            document.getElementById("Table1").appendChild(tr1);
            td = document.createElement("TD");
            tr1.appendChild(td);
            var div = document.createElement("DIV");
            div.setAttribute("class", "div");
            td.appendChild(div);
            table = document.createElement("TABLE");
            table.setAttribute("class", "table2");
            div.appendChild(table);
            var tr = document.createElement("TR");
            for (var i = 0; i < 1; i ++){
                table.appendChild(tr);
                td = document.createElement("TD");
                td.setAttribute("onclick", "logme(1)");
                tr.appendChild(td);
                text = document.createTextNode("17:30");
                td.appendChild(text);
                td = document.createElement("TD");
                td.setAttribute("onclick", "logme(2)");
                tr.appendChild(td);
                text = document.createTextNode("Paul");
                td.appendChild(text);
                tr = document.createElement("TR");
            }
    }
};

function initData() {
    var i;
    var idx=0;
    for (i=12; i<22;i++) {
        times[idx++] = i + ":00";
        times[idx++] = i + ":15";
        times[idx++] = i + ":30";
        times[idx++] = i + ":45";
    }
    times[idx++] = i + ":00";
    times[idx++] = i + ":15";
    times[idx++] = i + ":30";

    times.forEach(function(item) {
        console.log("Time: " + item);
    });

    excluded_days.push((new Date(2017,8,21)).getTime());
    excluded_days.push((new Date(2017,8,23)).getTime());
    excluded_days.push((new Date(2017,9,10)).getTime());
    excluded_days.push((new Date(2017,11,25)).getTime());

//    date = new Date(2017,9,20);
//    excluded_days.push(date.getTime());
//    date = new Date(2017,10,25);
//    excluded_days.push(date.getTime());
//    date = new Date(2017,11,25);
//    excluded_days.push(date.getTime());

    // Construct table arrays
    insideTables[1] = {type:"r2", x:0, y:350};
    insideTables[2] = {type:"r4", x:0, y:280};
    insideTables[3] = {type:"r2", x:0, y:220};
    insideTables[4] = {type:"r2", x:120, y:350};
    insideTables[5] = {type:"r4", x:120, y:280};
    insideTables[6] = {type:"r6", x:0, y:140};
    insideTables[7] = {type:"c8", x:120, y:200};
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
    insideTables[24] = {type:"r4", x:300, y:335};

    outsideTables[1] = {type:"r4",x:0,y:350};
    outsideTables[2] = {type:"r4", x:0, y:280};
    outsideTables[3] = {type:"r4", x:100, y:280};
    outsideTables[4] = {type:"r4", x:100, y:350};
    outsideTables[5] = {type:"c4", x:0, y:140};
    outsideTables[6] = {type:"c4", x:0, y:0};
    outsideTables[7] = {type:"c4", x:100, y:0};
    outsideTables[8] = {type:"c4", x:100, y:140};
    outsideTables[9] = {type:"r4", x:200, y:0};
    outsideTables[10] = {type:"r4", x:200, y:70};
    outsideTables[11] = {type:"r4", x:200, y:140};
    outsideTables[12] = {type:"r4", x:200, y:210};
    outsideTables[13] = {type:"r4", x:200, y:280};
    outsideTables[14] = {type:"c4", x:200, y:350};

    var tableid=1;
    var j;
    for (j = 1; j < insideTables.length; j++, tableid++){
        insideTables[j].width = 60;
        insideTables[j].height = 60;
        insideTables[j].count = j;
        insideTables[j].id = tableid;
        if (insideTables[j].type === "r4") insideTables[j].height = 70;
        else if (insideTables[j].type === "r6") insideTables[j].height = 80;
        else if (insideTables[j].type === "R4") insideTables[j].width = 70;
        else if (insideTables[j].type === "R6") insideTables[j].width = 80;
    }

    for (j = 1; j < outsideTables.length; j++, tableid++){
        outsideTables[j].width = 60;
        outsideTables[j].height = 60;
        outsideTables[j].count = j;
        if (tableid === 25) tableid=30;
        else if (tableid === 34) tableid=40;
        else if (tableid === 44) tableid=50;
        outsideTables[j].id = tableid;
        if (outsideTables[j].type === "r4") outsideTables[j].height = 70;
        else if (outsideTables[j].type === "r6") outsideTables[j].height = 80;
        else if (outsideTables[j].type === "R4") outsideTables[j].width = 70;
        else if (outsideTables[j].type === "R6") outsideTables[j].width = 80;
    }
}

function addKey(x, y) {
    var ctx = document.getElementById('floorplan').getContext('2d');
    ctx.beginPath();

    ctx.fillStyle=colour_comment;
    ctx.fillRect(x,y,10,10);
    ctx.fillStyle="#000000";
    ctx.fillText("Bookings with comments", x+15, y+10);
    y+= 15;
    ctx.fillStyle=colour_booking;
    ctx.fillRect(x,y,10,10);
    ctx.fillStyle="#000000";
    ctx.fillText("Bookings without comments", x+15, y+10);
    y+= 15;
    ctx.fillStyle=colour_empty;
    ctx.fillRect(x,y,10,10);
    ctx.fillStyle="#000000";
    ctx.fillText("No bookings yet", x+15, y+10);
}
function label(ctx, item) {
    var offset=(item.width-ctx.measureText(item.id).width)/2;
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
/*
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
*/
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
    ctx.fillStyle = item.colour;
    ctx.fillRect(x, y, tablesize, height);
    ctx.fillStyle = "#000000";
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
    ctx.fillStyle = item.colour;
    ctx.fillRect(x, y, tablesize, height);
    ctx.fillStyle = "#000000";
    ctx.rect(x, y, tablesize, height);
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
    ctx.fillStyle = item.colour;
    ctx.fill();
    ctx.fillStyle = "#000000";

    drawVSeats(ctx, x, y+radius-seatsize/2);
    drawHSeats(ctx, x+radius-seatsize/2, y);
    ctx.stroke();
    if (seats > 4) {
        var offsetplus = (tablesize+seatsize)/(2*root2);
        var offsetminus = (tablesize-seatsize)/(2*root2);
        //noinspection FallThroughInSwitchStatementJS
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
    ctx.clearRect(0,0,500,481);
    ctx.font = "14px Arial";

    var tables = (room===0)?insideTables:outsideTables;
    tables.forEach(function (item) {
        if (item.type === "r2") drawV(ctx, item, 2);
        else if (item.type === "r4") drawV(ctx, item, 4);
        else if (item.type === "r6") drawV(ctx, item, 6);
        else if (item.type === "R2") drawH(ctx, item, 2);
        else if (item.type === "R4") drawH(ctx, item, 4);
        else if (item.type === "R6") drawH(ctx, item, 6);
        else if (item.type === "c4") circle(ctx, item, 4);
        else if (item.type === "c5") circle(ctx, item, 5);
        else if (item.type === "c6") circle(ctx, item, 6);
        else if (item.type === "c7") circle(ctx, item, 7);
        else if (item.type === "c8") circle(ctx, item, 8);
        if (selected === item.id) {
            ctx.rect(item.x, item.y, item.width, item.height);
            ctx.stroke();
            if (selected in table_bookings) renderTableBookings(table_bookings[selected]);
            else renderTableBookings([]);
            /*
            renderTableBookings(
                [
                    {time:"18:00", size:0, comment:""},
                    {time:"18:30", size:2, comment:""},
                    {time:"20:00", size:2, comment:"Really big comment, can we have it wrap? Perhaps it might be too big, when specified as a single sentence ..................................."},
                    {time:"22:00", size:2, comment:"Table 5 please"}]);
                    */
//            xmlhttp.open("GET", url+"?Table=" + (item.count - 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + "&Date=" + convertToISODate(document.getElementById("datepicker").value), true);
            xmlhttp.open("GET", "https://msjhgasjyb.execute-api.eu-west-2.amazonaws.com/beta?Table=" + (item.count - 1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + "&Date=" + convertToISODate(document.getElementById("datepicker").value), true);
            xmlhttp.send();
        }
    });
    if (selected === 0) {
        document.getElementById("table_bookings").innerHTML = "";
    }
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

        selected = 0;
        var tables = (room===0)?insideTables:outsideTables;

        tables.forEach(function (item) {
            if ((mx > item.x) && (my > item.y) && (mx < item.x + item.width) && (my < item.y + item.height)) {
                selected = item.id;
            }
        });
        document.getElementById("Table1").innerHTML = "";
        render();
    }, true);
}

