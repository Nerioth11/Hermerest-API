function openEditAccountDialog() {
    $("#administratorUserInput").val($("#administratorUser").text());
    $("#administratorNameInput").val($("#administratorName").text());
    $("#administratorNewPasswordInput").val("");
    $("#administratorRepeatNewPasswordInput").val("");
    $("#administratorCurrentPasswordInput").val("");
    $("#editAccountModal").show();
}

function editAccount(id) {
    if ($("#administratorUserInput").val().trim() === "" || $("#administratorNameInput").val().trim() === "") alert("El nombre y el usuario no pueden estar vacíos");
    else if ($("#administratorNewPasswordInput").val().length > 0 && ($("#administratorNewPasswordInput").val().length < 4 || $("#administratorNewPasswordInput").val().length > 16 )) alert("La contraseña debe tener entre 4 y 16 caracteres");
    else if ($("#administratorNewPasswordInput").val() !== $("#administratorRepeatNewPasswordInput").val()) alert("Las contraseñas no coinciden");
    else if ($("#administratorCurrentPasswordInput").val().trim().length === 0) alert("Inserte su contraseña actual");
    else {
        patchCall("/administrators/" + id,
            {
                "user": $("#administratorUserInput").val(),
                "name": $("#administratorNameInput").val(),
                "oldPassword": $("#administratorCurrentPasswordInput").val(),
                "newPassword": $("#administratorNewPasswordInput").val(),
            },
            editAccountCallback
        );
    }
}

function editAccountCallback(response) {
    if (!response.success) {
        alert(response.error);
        return;
    }

    $("#administratorNameHeader").text(response.content.name);
    $("#administratorNameTitle").text(response.content.name);
    $("#administratorName").text(response.content.name);
    $("#administratorUser").text(response.content.user);

    closeModal();
}