"use strict"
const onSelectAddOption = function (category) {
    let popup = document.getElementById("popup");
    let form = popup.querySelector("form");
    form.elements.hidden_category.value = category;
    togglePopup(true);
}
const togglePopup = function (show) {
    let popup = document.getElementById("popup");
    if (show) {
        popup.style.visibility = "visible";
        popup.previousElementSibling.style.visibility = "visible";
    }
    else {
        popup.style.visibility = "hidden";
        popup.lastChild.style.visibility = "hidden";
        popup.previousElementSibling.style.visibility = "hidden";
    }
}
const submitOptionAdd = function (form) {
    let data = {
        hidden_category: $('#hidden_category').val(),
        option: $('#optionform_option').val()
    }
    let spinner = document.getElementById("loading-spinner");
    let alert_update = document.getElementById("alert_update");
    let base_url = window.location.protocol + "//" + window.location.host;
    spinner.style.visibility = "visible";
    $.ajax({
        type: 'POST',
        url: base_url + '/api/forms',
        data: data,
        error: (XHR, textStatus, errorThrown) => {
            // console.log(errorThrown);
            alert_update.className = "alert alert-danger";
            alert_update.innerText = "Error";
        },
        success: (data, textStatus) => {
            alert_update.className = "alert alert-success";
            alert_update.innerText = "Success";
        },
        complete: () => {
            spinner.style.visibility = "hidden";
            alert_update.style.visibility = "visible";
            
        }
    });
    event.preventDefault();
}

const closePopup = function(){
        window.location.replace(window.location.href);
        togglePopup(false);
}