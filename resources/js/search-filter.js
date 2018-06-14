var form = document.getElementById("search-form");
form.addEventListener("submit", function (event) {
    console.log(444);
    event.preventDefault();
    let request_object = {};

    let type = document.getElementById("search-type");
    let rpm = document.getElementById("search-rpm");
    let genre = document.getElementById("search-genre");
    let weight = document.getElementById("search-weight");
    let special = document.getElementById("search-special");
    let text = document.getElementById("search_text");

    // request_object.type = type.options[type.selectedIndex].value;
    // request_object.genre_id = Number(genre.options[genre.selectedIndex].value);
    // request_object.special = Number(special.options[special.selectedIndex].value);
    // request_object.rpm=Number(rpm.options[rpm.selectedIndex].value);
    // request_object.weight=Number(weight.options[weight.selectedIndex].value);
    window.location.href =
     ("/search?type="+ type.options[type.selectedIndex].value
     + "&query=" + encodeURIComponent(text.value) +
     (!isNaN(Number(rpm.options[rpm.selectedIndex].value))?("&rpm="+Number(rpm.options[rpm.selectedIndex].value)):"")+
     (!isNaN(Number(special.options[special.selectedIndex].value))?("&special="+Number(special.options[special.selectedIndex].value)):"")+
     (!isNaN(Number(genre.options[genre.selectedIndex].value))?("&genre="+Number(genre.options[genre.selectedIndex].value)):"")+
     (!isNaN(Number(weight.options[weight.selectedIndex].value))?("&weight="+Number(weight.options[weight.selectedIndex].value)):""));
});
