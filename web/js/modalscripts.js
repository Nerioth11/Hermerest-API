function closeModal() {
    $(".modal").hide();
}

// --------------------CENTRE--------------------
// CLASSES
function openNewClassDialog() {
    $("#classNameInput").val("");
    $("#newClassModal").show();
}

function addNewClass(centreId) {
    className = $("#classNameInput").val();
    if (className.trim().length === 0) alert("Rellene todos los campos");
    else {
        postCall("/centre/classes/add",
            {"className": className, "centreId": centreId},
            addNewClassCallback
        )
    }
}

function addNewClassCallback(response) {
    if (!response.added) {
        alert(response.error);
        return;
    }
    $("#classesTable").append(
        "<tr>" +
        "<td>" + response.addedClassName + "</td>" +
        "<td>0</td>" +
        "<td class='tableButton'><button class='infoButton'><a href='class?id=" + response.addedClassId + "'>Ver</a></button></td>" +
        "</tr>"
    );
    closeModal();
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

function editClass(classId) {
    className = $("#classNameInput").val();
    if (className.trim().length === 0) alert("Rellene todos los campos");
    else {
        postCall("/centre/class/edit",
            {"className": className, "classId": classId},
            editClassCallback
        )
    }
}

function editClassCallback(response) {
    if (!response.edited) {
        alert(response.error);
        return;
    }
    $("#className").text(response.className);
    closeModal();
}

function deleteStudentFromClass(studentId) {
    postCall("/centre/class/deleteStudent",
        {"studentId": studentId},
        deleteStudentFromClassCallback
    )
}

function deleteStudentFromClassCallback(response) {
    if (!response.deleted) {
        alert("No se pudo borrar al alumno");
        return;
    }

    $("#studentsTable #" + response.deletedStudentId).remove();
    $("#studentsDropdown").append(
        "<option value='" + response.deletedStudentId + "'>" +
        response.deletedStudentSurname + ", " + response.deletedStudentName +
        "</option>");
    $("#numberOfStudents").text($("#numberOfStudents").text() - 1);
}

function addStudentToClass(classId) {
    studentId = $("#studentsDropdown :selected").val();
    if (studentId === '-1') {
        alert("Seleccione un alumno");
        return;
    }
    postCall("/centre/class/addStudent",
        {"studentId": studentId, "classId": classId},
        addStudentToClassCallback
    )

}

function addStudentToClassCallback(response) {
    if (!response.added) {
        alert("No se pudo añadir al alumno");
        return;
    }

    $("#studentsTable").append(
        "<tr id='" + response.addedStudentId + "'>" +
        "<td>" + response.addedStudentSurname + ", " + response.addedStudentName + "</td>" +
        "<td class='tableButton'><button class='infoButton'><a href='student?id=" + response.addedStudentId + "'>Ver</a></button></td>" +
        "<td class='tableButton'><button class='warningButton' onclick='deleteStudentFromClass(" + response.addedStudentId + ")'>Eliminar</button></td>" +
        "</tr>"
    );

    $("#studentsDropdown [value='" + response.addedStudentId + "']").remove();
    $("#numberOfStudents").text(parseInt($("#numberOfStudents").text()) + 1);
    closeModal();

}

function hideNotMatchingStudentsFromStudentsDropdown() {
    if ($("#studentNameFilterInput").val().trim() === "") {
        $("#studentsDropdown").val('-1');
        $("#studentsDropdown > option").show();
        return;
    }

    numberOfVisibleOptions = 0;
    $("#studentsDropdown > option").each(function () {
        if ($(this).text().toLowerCase().includes($("#studentNameFilterInput").val().toLowerCase())) {
            $(this).show();
            $(this).prop('selected', true);
            numberOfVisibleOptions++;
        } else $(this).hide();
    });

    if (numberOfVisibleOptions === 0)
        $("#studentsDropdown").val('-1');
}

function deleteClass(classId) {
    if (!confirm("¿Está seguro de que desea eliminar el curso?")) return;

    postCall("/centre/class/delete",
        {"classId": classId},
        deleteClassCallback
    )
}

function deleteClassCallback(response) {
    if (!response.deleted) {
        alert("Error al eliminar la clase");
        return;
    }

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
        if ((rowClassName === className || className === " " || (className === "" && rowClassName === "-"))
            && rowStudentName.includes(studentName))
            $(this).show();
        else $(this).hide();
    });
}

function addParentToParentstist() {
    if ($("#parentFullnameInput").val().trim() === "" || $("#parentTelephoneInput").val().trim() === "" || $("#parentIdCardInput").val().trim() === "")
        alert("Rellene todos los campos");
    else if (isNaN($("#parentTelephoneInput").val().trim())) alert("El número de teléfono no es válido");
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

    if (studentName.trim() === "" || studentSurname.trim() === "") alert("Rellene todos los campos");
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
    $("#parentIdCardInput").val("");
    $("#parentFullnameInput").val("");
    $("#parentTelephoneInput").val("");
    $("#addParentModal #parentFullnameInput").prop("disabled", false);
    $("#addParentModal #parentTelephoneInput").prop("disabled", false);
    $("#addParentModal").show();
}

function openEditParentDialog(button) {
    parentIdCard = $(button).parent().parent().children().eq(0).text();
    parentFullname = $(button).parent().parent().children().eq(1).text();
    parentTelephone = $(button).parent().parent().children().eq(2).text();
    $("#editParentModal #parentFullnameInput").val(parentFullname);
    $("#editParentModal #parentTelephoneInput").val(parentTelephone);
    $("#editParentModal #parentIdCardInput").val(parentIdCard);
    $("#editParentModal").show();
}

function editStudent() {
    studentName = $("#studentNameInput").val()
    studentSurname = $("#studentSurnameInput").val()
    studentClass = $("#classDropdown :selected").text();

    if (studentName.trim() === "" || studentSurname.trim() === "") alert("Rellene todos los campos");
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
    parentFullname = $("#addParentModal #parentFullnameInput").val();
    parentTelephone = $("#addParentModal  #parentTelephoneInput").val();
    parentIdCard = $("#addParentModal  #parentIdCardInput").val();

    if (parentFullname.trim() === "" || parentTelephone.trim() === "" || parentIdCard.trim() === "") alert("Rellene todos los campos");
    else if (isNaN(parentTelephone)) alert("El número de teléfono tiene un formato incorrecto");
    else {
        $("#parentsTable").append(
            "<tr>" +
            "<td>" + parentFullname + "</td>" +
            "<td>" + parentTelephone + "</td>" +
            "<td>" + parentIdCard + "</td>" +
            "<td class='tableButton'><button class='primaryButton' onclick='openEditParentDialog(this)'>Editar</button></td>" +
            "<td class='tableButton'><button class='warningButton' onclick='deleteParent(this)'>Eliminar</button></td>" +
            "</tr>"
        );
        closeModal();
    }
}

function searchParentByIdCard(modalName) {
    idCard = $("#" + modalName + " #parentIdCardInput").val();

    if (idCard === "12345678") {
        $("#" + modalName + " #parentFullnameInput").val("Hernando Hernández");
        $("#" + modalName + " #parentTelephoneInput").val("666666666");
        $("#" + modalName + " #parentFullnameInput").prop("disabled", true);
        $("#" + modalName + " #parentTelephoneInput").prop("disabled", true);
    } else {
        $("#" + modalName + " #parentFullnameInput").prop("disabled", false);
        $("#" + modalName + " #parentTelephoneInput").prop("disabled", false);
    }
}

function editParent(id) {
    parentFullname = $("#editParentModal #parentFullnameInput").val();
    parentTelephone = $("#editParentModal  #parentTelephoneInput").val();
    parentIdCard = $("#editParentModal  #parentIdCardInput").val();

    if (parentFullname.trim() === "" || parentTelephone.trim() === "" || parentIdCard.trim() === "") alert("Rellene todos los campos");
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
    $("#circularSubjectInput").val("");
    $("#circularContentTextArea").val("");
    $("#sendCircularModal").show();
}

function openViewCircularDialog() {
    $("#viewCircularModal").show();
}

function sendCircular() {
    if ($("#circularSubjectInput").val().trim() === "") alert("El asunto de la circular no debe estar vacío");
    else {

        $("#circularsTable tbody").prepend(
            "<tr>" +
            "<td>" + getTodaysDate() + "</td>" +
            "<td>" + $("#circularSubjectInput").val() + "</td>" +
            "<td class='tableButton'><button class='infoButton' onclick='openViewCircularDialog()'>Ver</button></td>" +
            "</tr>"
        );
        closeModal();
    }
}

function filterCirculars() {
    circularSubject = $("#circularSubjectInputFilter").val().toLowerCase();
    circularMonth = $("#circularMonthDropdown :selected").val();
    $("#circularsTable > tbody > tr").each(function () {
        rowCircularSubject = $(this).children().eq(1).text().toLowerCase();
        rowCircularMonth = $(this).children().eq(0).text().substring(3, 5);
        if (rowCircularSubject.includes(circularSubject) && (rowCircularMonth === circularMonth || circularMonth === "")) $(this).show();
        else $(this).hide();
    });
}

// AUTHORIZATIONS
function openSendAuthorizationDialog() {
    $("#authorizationSubjectInput").val("");
    $("#authorizationDateInput").val("");
    $("#authorizationContentTextArea").val("");
    $("#sendAuthorizationModal").show();
}

function openViewAuthorizationDialog() {
    $("#viewAuthorizationModal").show();
}

function sendAuthorization() {
    if ($("#authorizationSubjectInput").val().trim() === "" || $("#authorizationDateInput").val().trim() === "") alert("El asunto y la fecha límite de la circular no deben estar vacíos");
    else if (dateComparator(dateInputToString($("#authorizationDateInput").val()), getTodaysDate()) === -1) alert("La fecha límite es anterior a la actual");
    else {

        $("#authorizationsTable tbody").prepend(
            "<tr>" +
            "<td>" + getTodaysDate() + "</td>" +
            "<td>" + $("#authorizationSubjectInput").val() + "</td>" +
            "<td>" + dateInputToString($("#authorizationDateInput").val()) + "</td>" +
            "<td class='tableButton'><button class='infoButton' onclick='openViewAuthorizationDialog()'>Ver</button></td>" +
            "</tr>"
        );
        closeModal();
    }
}

function filterAuthorizations() {
    authorizationSubject = $("#authorizationSubjectInputFilter").val().toLowerCase();
    authorizationMonth = $("#authorizationMonthDropdownFilter :selected").val();
    authorizationState = parseInt($("#authorizationStateDropdownFilter :selected").val());
    $("#authorizationsTable > tbody > tr").each(function () {
        rowAuthorizationState = dateComparator($(this).children().eq(2).text(), getTodaysDate());
        rowAuthorizationSubject = $(this).children().eq(1).text().toLowerCase();
        rowAuthorizationMonth = $(this).children().eq(0).text().substring(3, 5);
        if (rowAuthorizationSubject.includes(authorizationSubject) &&
            (rowAuthorizationMonth === authorizationMonth || authorizationMonth === "") &&
            (rowAuthorizationState === authorizationState || authorizationState === 0)) $(this).show();
        else $(this).hide();
    });
}

// POLLS
function openSendPollDialog() {
    $("#pollSubjectInput").val("");
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
    if ($("#pollSubjectInput").val().trim() === "" || $("#pollDateInput").val().trim() === "") alert("El asunto y la fecha límite de la circular no deben estar vacíos");
    else if (dateComparator(dateInputToString($("#pollDateInput").val()), getTodaysDate()) === -1) alert("La fecha límite es anterior a la actual");
    else {

        $("#pollsTable tbody").prepend(
            "<tr>" +
            "<td>" + getTodaysDate() + "</td>" +
            "<td>" + $("#pollSubjectInput").val() + "</td>" +
            "<td>" + dateInputToString($("#pollDateInput").val()) + "</td>" +
            "<td class='tableButton'><button class='infoButton' onclick='openViewPollDialog()'>Ver</button></td>" +
            "</tr>"
        );
        closeModal();
    }
}

function filterPolls() {
    pollSubject = $("#pollSubjectInputFilter").val().toLowerCase();
    pollMonth = $("#pollMonthDropdownFilter :selected").val();
    pollState = parseInt($("#pollStateDropdownFilter :selected").val());
    $("#pollsTable > tbody > tr").each(function () {
        rowPollState = dateComparator($(this).children().eq(2).text(), getTodaysDate());
        rowPollSubject = $(this).children().eq(1).text().toLowerCase();
        rowPollMonth = $(this).children().eq(0).text().substring(3, 5);
        if (rowPollSubject.includes(pollSubject) &&
            (rowPollMonth === pollMonth || pollMonth === "") &&
            (rowPollState === pollState || pollState === 0)) $(this).show();
        else $(this).hide();
    });
}