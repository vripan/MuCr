let search_form = document.getElementById("search_from");
let search_button = document.getElementById("search_button");
let search_text = document.getElementById("search_text");
let search_type = document.getElementById("search_type");
let search_submit = document.getElementById("search_submit");

search_form.addEventListener("submit", (event) => {
    event.preventDefault();
    window.location.href = "/search?type=" + search_type.options[search_type.selectedIndex].value + "&query=" + encodeURIComponent(search_text.value);
});