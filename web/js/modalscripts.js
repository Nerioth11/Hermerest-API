function closeModal() {
    $(".modal").hide();
}

// --------------------CENTRE--------------------
// CLASSES
function openNewClassDialog() {
    $("#classNameInput").val("");
    $("#newClassModal").show();
}

function addNewClass() {
    className = $("#classNameInput").val();
    if (className.trim().length === 0) alert("El nombre no debe estar vacío");
    else {
        $("#classesTable").append(
            "<tr>" +
            "<td>" + className + "</td>" +
            "<td>0</td>" +
            "<td class='tableButton'><button class='infoButton'><a href='class'>Ver</a></button></td>" +
            "</tr>"
        );
        closeModal();
    }
}

// CLASS
function openEditClassDialog() {
    $("#editClassModal").show();
}

function openAddStudentDialog() {
    $("#studentNameFilterInput").val("");
    hideNotMatchingStudentsFromStudentsDropdown();
    $("#addStudentModal").show();
}

function editClass() {
    className = $("#classNameInput").val();
    if (className.trim().length === 0) alert("El nombre no debe estar vacío");
    else {
        $("#className").text(className);
        closeModal();
    }
}

function deleteStudentFromClass(button) {
    button.parentNode.parentNode.remove();
    $("#numberOfStudents").text($("#numberOfStudents").text() - 1);
}

function addStudentToClass() {
    studentName = $("#studentsDropdown :selected").text();
    $("#studentsTable").append(
        "<tr>" +
        "<td>" + studentName + "</td>" +
        "<td class='tableButton'><button class='infoButton'><a href='student'>Ver</a></button></td>" +
        "<td class='tableButton'><button class='warningButton' onclick='deleteStudentFromClass(this)'>Eliminar</button></td>" +
        "</tr>"
    );
    $("#numberOfStudents").text(parseInt($("#numberOfStudents").text()) + 1);
    closeModal();
}

function hideNotMatchingStudentsFromStudentsDropdown() {
    $("#studentsDropdown > option").each(function () {
        if ($(this).text().toLowerCase().includes($("#studentNameFilterInput").val().toLowerCase())) $(this).show();
        else $(this).hide();
    });
}

function deleteClass() {
    if (confirm("¿Está seguro de que desea eliminar el curso?"))
        window.location.replace("classes");
}

// STUDENTS
function openRegisterStudentDialog() {
    $("#registerStudentModal").show();
    $("#studentNameInput").val("");
    $("#studentSurnameInput").val("");
    $("#parentNameInput").val("");
    $("#parentTelephoneInput").val("");
}

function filterStudents() {
    className = $("#classFilterDropdown :selected").val();
    studentName = $("#studentNameFilterInput").val().toLowerCase();
    $("#studentsTable > tbody > tr").each(function () {
        rowClassName = $(this).children().eq(1).text();
        rowStudentName = $(this).children().eq(0).text().toLowerCase();
        if ((rowClassName === className || className === "") && rowStudentName.includes(studentName)) $(this).show();
        else $(this).hide();
    });
}

function addParentToParentstist() {
    if ($("#parentFullnameInput").val().trim() === "" || $("#parentTelephoneInput").val().trim() === "")
        alert("El nombre y el teléfono no deben estar vacíos");
    else if(isNaN($("#parentTelephoneInput").val().trim())) alert("El número de teléfono no es válido");
    else {
        $("#addedParentsList").append("<li>" + $("#parentFullnameInput").val() + "<a class='deleteCross' onclick='deleteParentFromParentsList(this)'>&times;</a></li>");
    }
}

function deleteParentFromParentsList(button) {
    button.parentNode.remove();
}

function registerStudent() {
    studentName = $("#studentNameInput").val()
    studentSurname = $("#studentSurnameInput").val()
    studentClass = $("#classDropdown :selected").text();

    if (studentName.trim() === "" || studentSurname.trim() === "") alert("El nombre y los apellidos no deben estar vacíos");
    else {
        $("#studentsTable").append(
            "<tr>" +
            "<td>" + studentName + " " + studentSurname + "</td>" +
            "<td>" + studentClass + "</td>" +
            "<td class='tableButton'><button class='infoButton'><a href='student'>Ver</a></button></td>" +
            "</tr>"
        );
        closeModal();
    }
}

// STUDENT
function openEditStudentDialog() {
    $("#editStudentModal").show();
}

function openAddParentDialog() {
    $("#addParentModal").show();
    $("#parentFullnameInput").val("");
    $("#parentTelephoneInput").val("");
}

function openEditParentDialog(button) {
    $("#editParentModal").show();
    parentFullname = $(button).parent().parent().children().eq(0).text();
    parentTelephone = $(button).parent().parent().children().eq(1).text();
    $("#editParentModal #parentFullnameInput").val(parentFullname);
    $("#editParentModal #parentTelephoneInput").val(parentTelephone);
}

function editStudent() {
    studentName = $("#studentNameInput").val()
    studentSurname = $("#studentSurnameInput").val()
    studentClass = $("#classDropdown :selected").text();

    if (studentName.trim() === "" || studentSurname.trim() === "") alert("El nombre y los apellidos no deben estar vacíos");
    else {
        $("#studentFullName").text(studentName + " " + studentSurname);
        $("#studentName").text(studentName);
        $("#studentSurname").text(studentSurname);
        $("#studentClass").text(studentClass);
        closeModal();
    }
}

function deleteStudent() {
    if (confirm("¿Está seguro de que desea eliminar al alumno?"))
        window.location.replace("students");
}


function addParent() {
    parentFullname = $("#addParentModal #parentFullnameInput").val()
    parentTelephone = $("#addParentModal  #parentTelephoneInput").val()

    if (parentFullname.trim() === "" || parentTelephone.trim() === "") alert("El nombre y los apellidos no deben estar vacíos");
    else if (isNaN(parentTelephone)) alert("El número de teléfono tiene un formato incorrecto");
    else {
        $("#parentsTable").append(
            "<tr>" +
            "<td>" + parentFullname + "</td>" +
            "<td>" + parentTelephone + "</td>" +
            "<td class='tableButton'><button class='primaryButton' onclick='openEditParentDialog(this)'>Editar</button></td>" +
            "<td class='tableButton'><button class='warningButton' onclick='deleteParent(this)'>Eliminar</button></td>" +
            "</tr>"
        );
        closeModal();
    }
}

function editParent(id) {
    parentFullname = $("#editParentModal #parentFullnameInput").val()
    parentTelephone = $("#editParentModal  #parentTelephoneInput").val()

    if (parentFullname.trim() === "" || parentTelephone.trim() === "") alert("El nombre y los apellidos no deben estar vacíos");
    else if (isNaN(parentTelephone)) alert("El número de teléfono tiene un formato incorrecto");
    else {
        //TODO: editar la fila de la tabla
        //para saber el id te la fila, establecerlo en el parámetro del onclick al abrir el diálogo
        closeModal();
    }
}

function deleteParent(button) {
    if (confirm("¿Está seguro de que desea eliminar al padre?"))
        button.parentNode.parentNode.remove();
}

// --------------------MESSAGING--------------------
// CIRCULARS
function openSendCircularDialog() {
    $("#circularTitleInput").val("");
    $("#circularContentTextArea").val("");
    $("#sendCircularModal").show();
}

function openViewCircularDialog() {
    $("#viewCircularModal").show();
}

function sendCircular() {
    if ($("#circularTitleInput").val().trim() === "") alert("El título de la circular no debe estar vacío");
    else {

        $("#circularsTable tbody").prepend(
            "<tr>" +
            "<td>" + getTodaysDate() + "</td>" +
            "<td>" + $("#circularTitleInput").val() + "</td>" +
            "<td class='tableButton'><button class='infoButton' onclick='openViewCircularDialog()'>Ver</button></td>" +
            "</tr>"
        );
        closeModal();
    }
}

function filterCirculars() {
    circularTitle = $("#circularTitleInputFilter").val().toLowerCase();
    circularMonth = $("#circularMonthDropdown :selected").val();
    $("#circularsTable > tbody > tr").each(function () {
        rowCircularTitle = $(this).children().eq(1).text().toLowerCase();
        rowCircularMonth = $(this).children().eq(0).text().substring(3, 5);
        if (rowCircularTitle.includes(circularTitle) && (rowCircularMonth === circularMonth || circularMonth === "")) $(this).show();
        else $(this).hide();
    });
}

// AUTHORIZATIONS
function openSendAuthorizationDialog() {
    $("#authorizationTitleInput").val("");
    $("#authorizationDateInput").val("");
    $("#authorizationContentTextArea").val("");
    $("#sendAuthorizationModal").show();
}

function openViewAuthorizationDialog() {
    $("#viewAuthorizationModal").show();
}

function sendAuthorization() {
    if ($("#authorizationTitleInput").val().trim() === "" || $("#authorizationDateInput").val().trim() === "") alert("El título y la fecha límite de la circular no deben estar vacíos");
    else if (dateComparator(dateInputToString($("#authorizationDateInput").val()), getTodaysDate()) === -1) alert("La fecha límite es anterior a la actual");
    else {

        $("#authorizationsTable tbody").prepend(
            "<tr>" +
            "<td>" + getTodaysDate() + "</td>" +
            "<td>" + $("#authorizationTitleInput").val() + "</td>" +
            "<td>" + dateInputToString($("#authorizationDateInput").val()) + "</td>" +
            "<td class='tableButton'><button class='infoButton' onclick='openViewAuthorizationDialog()'>Ver</button></td>" +
            "</tr>"
        );
        closeModal();
    }
}

function filterAuthorizations() {
    authorizationTitle = $("#authorizationTitleInputFilter").val().toLowerCase();
    authorizationMonth = $("#authorizationMonthDropdownFilter :selected").val();
    authorizationState = parseInt($("#authorizationStateDropdownFilter :selected").val());
    $("#authorizationsTable > tbody > tr").each(function () {
        rowAuthorizationState = dateComparator($(this).children().eq(2).text(), getTodaysDate());
        rowAuthorizationTitle = $(this).children().eq(1).text().toLowerCase();
        rowAuthorizationMonth = $(this).children().eq(0).text().substring(3, 5);
        if (rowAuthorizationTitle.includes(authorizationTitle) &&
            (rowAuthorizationMonth === authorizationMonth || authorizationMonth === "") &&
            (rowAuthorizationState === authorizationState || authorizationState === 0)) $(this).show();
        else $(this).hide();
    });
}

// POLLS
function openSendPollDialog() {
    $("#pollTitleInput").val("");
    $("#pollDateInput").val("");
    $("#pollContentTextArea").val("");
    $("#sendPollModal").show();
}

function openViewPollDialog() {
    $("#viewPollModal").show();
}

function addPollOption() {
    if ($("#newPollOptionInput").val().trim() === "") alert("La opción no debe estar vacía");
    else {
        $("#addedPollOptionsList").append("<li>" + $("#newPollOptionInput").val() + "<a  class='deleteCross' onclick='deletePollOption(this)'>&times;</a></li>");
    }
}

function deletePollOption(button) {
    button.parentNode.remove();
}

function sendPoll() {
    if ($("#pollTitleInput").val().trim() === "" || $("#pollDateInput").val().trim() === "") alert("El título y la fecha límite de la circular no deben estar vacíos");
    else if (dateComparator(dateInputToString($("#pollDateInput").val()), getTodaysDate()) === -1) alert("La fecha límite es anterior a la actual");
    else {

        $("#pollsTable tbody").prepend(
            "<tr>" +
            "<td>" + getTodaysDate() + "</td>" +
            "<td>" + $("#pollTitleInput").val() + "</td>" +
            "<td>" + dateInputToString($("#pollDateInput").val()) + "</td>" +
            "<td class='tableButton'><button class='infoButton' onclick='openViewPollDialog()'>Ver</button></td>" +
            "</tr>"
        );
        closeModal();
    }
}

function filterPolls() {
    pollTitle = $("#pollTitleInputFilter").val().toLowerCase();
    pollMonth = $("#pollMonthDropdownFilter :selected").val();
    pollState = parseInt($("#pollStateDropdownFilter :selected").val());
    $("#pollsTable > tbody > tr").each(function () {
        rowPollState = dateComparator($(this).children().eq(2).text(), getTodaysDate());
        rowPollTitle = $(this).children().eq(1).text().toLowerCase();
        rowPollMonth = $(this).children().eq(0).text().substring(3, 5);
        if (rowPollTitle.includes(pollTitle) &&
            (rowPollMonth === pollMonth || pollMonth === "") &&
            (rowPollState === pollState || pollState === 0)) $(this).show();
        else $(this).hide();
    });
}