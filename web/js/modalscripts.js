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
    $("#sendCircularModal").show();
}

function openViewCircularDialog() {
    $("#viewCircularModal").show();
}

// AUTHORIZATIONS
function openSendAuthorizationDialog() {
    $("#sendAuthorizationModal").show();
}

function openViewAuthorizationDialog() {
    $("#viewAuthorizationModal").show();
}

// POLLS
function openSendPollDialog() {
    $("#sendPollModal").show();
}

function openViewPollDialog() {
    $("#viewPollModal").show();
}
