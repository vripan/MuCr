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


let ajax_register_listener = function () {
        switch (this.readyState) {
            case 0:
            case 1:
            case 2:
            case 3:
                document.getElementById("submit_button").disabled = true;
                show_warning("Registering...");
                break;
            case 4:
                let response;
                document.getElementById("submit_button").disabled = false;
                document.getElementById("submit_button").innerText = "Register";
                try {
                    response = JSON.parse(this.responseText);
                } catch (err) {
                    show_error("Bad server response. Try again.");
                    return;
                }
                if (response === undefined || response.code === undefined || response.msg === undefined) {
                    show_error("Invalid server response. Try again.");
                    return;
                }

                if (response.code === 0) {
                    let _form = document.getElementById('registration');
                    if (_form) _form.reset();

                    show_succcess("Account created!\nYou will be redirected to login page.");
                    setTimeout(() => {
                        window.location.href = "/static/login";
                    }, 4000);
                }
                else {
                    show_warning(response.msg);
                }
        }
    }
;

document.getElementById("registration").addEventListener("submit", function (event) {
    event.preventDefault();
    let request_object = {};

    let fname = document.getElementById("firstname");
    let lname = document.getElementById("lastname");
    let email = document.getElementById("email");
    let passw = document.getElementById("password");

    let info = document.getElementById("msg");

    if (info === undefined) return;

    if (fname === undefined || lname === undefined || email === undefined || passw === undefined) {
        show_error("Something went wrong. Reload the page.");
        return;
    }

    request_object.firstname = fname.value;
    request_object.lastname = lname.value;
    request_object.email = email.value;
    request_object.password = passw.value;

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = ajax_register_listener;

    xhttp.open("PUT", "/user", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    console.log(JSON.stringify(request_object));
    xhttp.send(JSON.stringify(request_object));
});