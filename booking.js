function cancelBooking(id, email) {
    document.getElementById("output").innerHTML = "";
    //alert("Cancelling " + id + " for " + email);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var response = JSON.parse(this.responseText);
//                alert("Booking " + size + " on " + date + " at " + time + " for " + email);
                document.getElementById("status").innerHTML = "Successfully cancelled reservation for ref:" + id;
            }
            else {
                document.getElementById("status").innerHTML = "Error cancelling reservation for ref:" + id;
            }
        }
    };
    xhttp.open("DELETE", "https://msjhgasjyb.execute-api.eu-west-2.amazonaws.com/beta/demo/website?ID=" + id + "&Email=" + encodeURIComponent(email), true);

    xhttp.send();

}
function validateEmail(email) {
    var re = "/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/";
    if (email == '') {
        return false;
    }
    return true;
}
function convertToISODate(date) {
    var mydate = new Date(date);
    return mydate.toString("yyyy-MM-dd");
}
function convertFromISODate(date) {
    var mydate = new Date(date);
    return mydate.toString("dd MMM yyyy");
}
function book(time, size) {
    var email = document.getElementById("email").value;
    var date = document.getElementById("datepicker").value;
    if (email == 'Restaurant') {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(this.responseText);
                document.getElementById("output").innerHTML = "<table><tr><th>Id</th><td>" + response.ID + "</td></tr>" +
                    "<tr><th>Party Size</th><td>" + response.Size + "</td></tr>" +
                    "<tr><th>Date</th><td>" + convertFromISODate(response.Date) + "</td></tr>" +
                    "<tr><th>Time</th><td>" + response.Time + "</td></tr></table>" +
                    "<br/><button onclick=\"cancelBooking(" + response.ID + ",'" + response.Email + "')\">Cancel</button>";
                document.getElementById("status").innerHTML = "Reservation confirmed for phone booking, ref: " + response.ID;
            }
        };
        xhttp.open("POST", "https://msjhgasjyb.execute-api.eu-west-2.amazonaws.com/beta/demo/website", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        xhttp.send({Email:email, Size:size, Date:convertToISODate(date), Time:time});
//        xhttp.send(JSON.stringify({Email:email, Size:size, Date: Time:datetime}));

    }
    else if (!validateEmail(email)) alert("Invalid email address");
    else
    {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
//                alert(this.responseText);
                var response = JSON.parse(this.responseText);
//                alert("Booking " + size + " on " + date + " at " + time + " for " + email);
                document.getElementById("output").innerHTML = "<table><tr><th>Id</th><td>" + response.ID + "</td></tr>" +
                    "<tr><th>Email</th><td>" + response.Email + "</td></tr>" +
                    "<tr><th>Party Size</th><td>" + response.Size + "</td></tr>" +
                    "<tr><th>Date</th><td>" + convertFromISODate(response.Date) + "</td></tr>" +
                    "<tr><th>Time</th><td>" + response.Time + "</td></tr></table>" +
                    "<br/><button onclick=\"cancelBooking(" + response.ID + ",'" + response.Email + "')\">Cancel</button>";
                document.getElementById("status").innerHTML = "Reservation confirmed, ref: " + response.ID + ". You will receive a confirmation email shortly.";
            }
        };
        xhttp.open("POST", "https://msjhgasjyb.execute-api.eu-west-2.amazonaws.com/beta/demo/website", true);
        xhttp.setRequestHeader("Content-type", "application/json");

        xhttp.send(JSON.stringify({Email:email, Size:size, Date:convertToISODate(date), Time:time}));
//        xhttp.send(JSON.stringify({Email:email, Size:size, Date: Time:datetime}));
    }
}
function getBooking() {
    var id = document.getElementById("id").value;
    var email = document.getElementById("email").value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
//                alert("Booking " + size + " on " + date + " at " + time + " for " + email);
            document.getElementById("output").innerHTML = "<table><tr><th>Id</th><td>" + response.ID + "</td></tr>" +
                "<tr><th>Email</th><td>" + response.Email + "</td></tr>" +
                "<tr><th>Size</th><td>" + response.Size + "</td></tr>" +
                "<tr><th>Date</th><td>" + convertFromISODate(response.Date) + "</td></tr>" +
                "<tr><th>Time</th><td>" + response.Time + "</td></tr></table>" +
                "<br/><button onclick=\"cancelBooking(" + response.ID + ",'" + response.Email + "')\">Cancel</button>";
            document.getElementById("status").innerHTML = "Booking found";
        }
    };
    xhttp.open("GET", "https://msjhgasjyb.execute-api.eu-west-2.amazonaws.com/beta/demo/website?ID=" + id + "&Email=" + encodeURIComponent(email), true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.send();
}
function getTimes() {
    var date = document.getElementById("datepicker").value;
    var size = document.getElementById("size").value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(this.responseText);
            var len, i, text;
            len = response.Timeslots.length;
            text = "";
            for (i = 0; i < len; i++) {
                text += "<tr><td><button onclick=\"book('" + response.Timeslots[i] + "','" + size + "')\">Book for " + response.Timeslots[i] + "</button></td></tr>";
            }
            document.getElementById("output").innerHTML = "<input type='hidden' id='datepicker' value='" + date + "'><table><tr><td>Email:</td><td><input type='text' id='email'/></td></tr></table><br/><table>" + text + "</table>";
            document.getElementById("status").innerHTML = "" + len + " available slots for " + size + " people on " + date + ". Click on time to book";
        }
    };
    xhttp.open("GET", "https://msjhgasjyb.execute-api.eu-west-2.amazonaws.com/beta/demo/website?Size=" + size + "&Date=" + convertToISODate(date), true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.send();
}
