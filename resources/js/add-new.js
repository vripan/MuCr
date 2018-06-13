var activities = document.getElementById("slct");
var center = document.getElementById("slct-container");
var form1 = document.getElementById("form1");
var form2 = document.getElementById("form2");
var form3 = document.getElementById("form3");
var form4 = document.getElementById("form4");

activities.addEventListener("change", function () {
    console.log(activities.options[activities.selectedIndex].value);
    if (activities.options[activities.selectedIndex].value === "1") {
        center.style.display="none";
        form1.style.display="block";
    }
    if (activities.options[activities.selectedIndex].value === "2") {
        center.style.display="none";
        form2.style.display="block";
    }
    if (activities.options[activities.selectedIndex].value === "3") {
        center.style.display="none";
        form3.style.display="block";
    }
    if (activities.options[activities.selectedIndex].value === "4") {
        center.style.display="none";
        form4.style.display="block";
    }

});


    let clear_message_container = function () {
        let info = document.getElementById("msg");

        if (info.classList.contains("message-error"))
            info.classList.remove("message-error");

        if (info.classList.contains("message-warning"))
            info.classList.remove("message-warning");

        if (info.classList.contains("message-success"))
            info.classList.remove("message-success");

        if (!info.classList.contains("message"))
            info.classList.add("message");

        info.innerText = "";
    };

    let show_error = function (message) {
        let info = document.getElementById("msg");
        clear_message_container();

        info.classList.add("message-error");
        info.innerHTML = message;
    };
    let show_warning = function (message) {
        let info = document.getElementById("msg");
        clear_message_container();

        info.classList.add("message-warning");
        info.innerText = message;
    };
    let show_succcess = function (message) {
        let info = document.getElementById("msg");
        clear_message_container();

        info.classList.add("message-success");
        info.innerText = message;
    };

    let ajax_form_listener = function () {
        switch (this.readyState) {
            case 0:
            case 1:
            case 2:
            case 3:
                break;
            case 4:
                let response;
                
                
                try {
                    response = JSON.parse(this.response);
                } catch (err) {
                    show_error("Bad server response. Try again.");
                    return;
                }
                if (response === undefined || response.code === undefined || response.msg === undefined) {
                    show_error("Invalid server response. Try again.");
                    return;
                }

                if (response.code === 0) {
                    let _form = document.getElementById('form4');
                    if (_form) _form.reset();

                    show_succcess("Item added to your collection!\nYou will be redirected to your page");
                    setTimeout(() => {
                        window.location.href = "/user";
                    }, 1500);
                }
                else {
                    show_warning(response.msg);
                }
        }
    }
;
document.getElementById("submit1").addEventListener("click", function (event) {
    console.log(444);
    event.preventDefault();
    let request_object = {};

    let artist = document.getElementById("v-artist");
    let label = document.getElementById("v-label");
    let genre = document.getElementById("v-genre");
    let title = document.getElementById("v-title");
    let state = document.getElementById("v-state");
    let condition = document.getElementById("v-condition");
    let channel = document.getElementById("v-channel");
    let color = document.getElementById("v-color");
    let rpm = document.getElementById("v-rpm");
    let weight = document.getElementById("v-weight");
    let special = document.getElementById("v-special");

   
    request_object.title = title.value;
    request_object.artist = artist.value;
    request_object.genre_id = Number(genre.options[genre.selectedIndex].value);
    request_object.label = label.value;
    request_object.special = Number(special.options[special.selectedIndex].value);
    request_object.state=Number(state.options[state.selectedIndex].value);
    request_object.condition=Number(condition.options[condition.selectedIndex].value);
    request_object.channel=Number(channel.options[channel.selectedIndex].value);
    request_object.color=Number(color.options[color.selectedIndex].value);
    request_object.rpm=Number(rpm.options[rpm.selectedIndex].value);
    request_object.weight=Number(weight.options[weight.selectedIndex].value);

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = ajax_form_listener;
    xhttp.open("POST", "/vinyl", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    console.log(JSON.stringify(request_object));
    xhttp.send(JSON.stringify(request_object));
});
document.getElementById("submit2").addEventListener("click", function (event) {
    console.log(444);
    event.preventDefault();
    let request_object = {};

    let artist = document.getElementById("cd-artist");
    let label = document.getElementById("cd-label");
    let genre = document.getElementById("cd-genre");
    let title = document.getElementById("cd-title");
    let duration = document.getElementById("cd-duration");
   
    request_object.title = title.value;
    request_object.artist = artist.value;
    request_object.genre_id = Number(genre.options[genre.selectedIndex].value);
    request_object.label = label.value;
    request_object.duration = Number(duration.value);

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = ajax_form_listener;
    xhttp.open("POST", "/cd", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    console.log(JSON.stringify(request_object));
    xhttp.send(JSON.stringify(request_object));
});

document.getElementById("submit3").addEventListener("click", function (event) {
    console.log(444);
    event.preventDefault();
    let request_object = {};

    let artist = document.getElementById("cs-artist");
    let label = document.getElementById("cs-label");
    let genre = document.getElementById("cs-genre");
    let title = document.getElementById("cs-title");
    let duration = document.getElementById("cs-duration");
    let state = document.getElementById("cs-state");
    let channel = document.getElementById("cs-channel");
    let type = document.getElementById("cs-type");
   
    request_object.title = title.value;
    request_object.artist = artist.value;
    request_object.genre_id = Number(genre.options[genre.selectedIndex].value);
    request_object.label = label.value;
    request_object.duration = Number(duration.value);
    request_object.state=Number(state.options[state.selectedIndex].value);
    request_object.channel=Number(channel.options[channel.selectedIndex].value);
    request_object.type=Number(type.options[type.selectedIndex].value);

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = ajax_form_listener;
    xhttp.open("POST", "/cassette", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    console.log(JSON.stringify(request_object));
    xhttp.send(JSON.stringify(request_object));
});


document.getElementById("submit4").addEventListener("click", function (event) {
    console.log(444);
    event.preventDefault();
    let request_object = {};

    let artist = document.getElementById("ticket-artist");
    let tour = document.getElementById("ticket-tour");
    let genre = document.getElementById("ticket-genre");
    let location = document.getElementById("ticket-location");
    let date = document.getElementById("ticket-date");
    let price = document.getElementById("ticket-price")
    var d = new Date(date.value);
    request_object.artist = artist.value;
    request_object.event_name = tour.value;
    request_object.genre_id = Number(genre.options[genre.selectedIndex].value);
    request_object.location = location.value;
    request_object.start_date = d.toJSON();
    request_object.price = Number(price.value);

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = ajax_form_listener;
    xhttp.open("POST", "/ticket", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    console.log(JSON.stringify(request_object));
    xhttp.send(JSON.stringify(request_object));
});

