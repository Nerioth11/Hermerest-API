function closeModal() {
    $(".modal").hide();
}

// --------------------CENTRE--------------------
// CLASSES

function handleAutoimportFile(files) {
    if (files[0] === undefined) return;
    if (!confirm("¿Está seguro que desea autoimportar los datos desde el fichero \"" + files[0].name + "\"?")) return;

    var selectedFile = files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
        var data = event.target.result;
        autoimportClasses(data);
    };
    reader.readAsText(selectedFile);
    $("#files").val("");
}

function autoimportClasses(data) {
    var lines = data.split("\r\n");
    var currentClass = "";
    var currentStudents = "";

    lines.forEach(
        function (line) {
            if (!line.includes(",")) {
                autoimportClass(currentClass, currentStudents);
                currentClass = line;
                currentStudents = "";
            } else currentStudents += line + "\n";

        });

    autoimportClass(currentClass, currentStudents)
}

function autoimportClass(className, students) {
    if (className.trim().length === 0) return;

    console.log("autoimportando la clase: " + className + "\n");
    console.log(students + "\n");

    postCall("/centre/classes/autoimportClass",
        {"className": className, "students": students.split("\n")},
        autoimportClassCallback
    );
}

function autoimportClassCallback(response) {
    if (!response.imported) {
        alert(response.error);
        return;
    }

    $("#classesTable").append(
        "<tr>" +
        "<td>" + response.addedClassName + "</td>" +
        "<td>" + response.addedClassStudents + "</td>" +
        "<td class='tableButton'><button class='infoButton'><a href='class?id=" + response.addedClassId + "'>Ver</a></button></td>" +
        "</tr>"
    );
}


function openNewClassDialog() {
    $("#classNameInput").val("");
    $("#newClassModal").show();
}

function addNewClass(centreId) {
    var className = $("#classNameInput").val();
    if (className.trim().length === 0) alert("Rellene todos los campos");
    else {
        postCall("/centre/classes/add",
            {"className": className, "centreId": centreId},
            addNewClassCallback
        );
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
    $("#classNameInput").val($("#className").text());
    $("#editClassModal").show();
}

function openAddStudentDialog() {
    $("#studentNameFilterInput").val("");
    hideNotMatchingStudentsFromStudentsDropdown();
    $("#addedStudentsList").empty();
    $("#addStudentModal").show();
}

function editClass(classId) {
    var className = $("#classNameInput").val();
    if (className.trim().length === 0) alert("Rellene todos los campos");
    else {
        postCall("/centre/class/edit",
            {"className": className, "classId": classId},
            editClassCallback
        );
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
    );
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

function addStudentToStudentsList() {
    var studentId = $("#studentsDropdown :selected").val();
    var studentFullname = $("#studentsDropdown :selected").text();
    if (studentId === '-1') {
        alert("Seleccione un alumno");
        return;
    }

    $("#addedStudentsList").append("<li id='" + studentId + "'>" + studentFullname + "<a class='deleteCross' onclick='deleteStudentFromStudentsList(this)'>&times;</a></li>");
    $("#studentsDropdown [value='" + studentId + "']").remove();
}

function deleteStudentFromStudentsList(button) {
    button.parentNode.remove();
    $("#studentsDropdown").append("<option value='" + $(button).parent().attr('id') + "'>" + $(button).parent().text().slice(0, -1) + "</option>");
    hideNotMatchingStudentsFromStudentsDropdown();
}

function addStudentToClass(classId) {
    var studentsIds = [];
    $("#addedStudentsList li").each(function () {
        studentsIds.push($(this).attr('id'));
    });


    if (studentsIds.length === 0) {
        alert("Seleccione algún alumno");
        return;
    }

    for (var i = 0; i < studentsIds.length; i++) {
        postCall("/centre/class/addStudent",
            {"studentId": studentsIds[i], "classId": classId},
            addStudentToClassCallback
        );
    }
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

    var numberOfVisibleOptions = 0;
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
    );
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
    $("#studentNameInput").val("");
    $("#studentSurnameInput").val("");
    $("#parentTelephoneInput").val("");
    $("#parentFullnameInput").val("");
    $("#registerStudentModal #parentFullnameInput").prop("disabled", true);
    $("#addedParentsList").empty();
    $("#registerStudentModal").show();
}

function filterStudents() {
    var className = $("#classFilterDropdown :selected").val();
    var studentName = $("#studentNameFilterInput").val().toLowerCase();
    $("#studentsTable > tbody > tr").each(function () {
        var rowClassName = $(this).children().eq(1).text();
        var rowStudentName = $(this).children().eq(0).text().toLowerCase();
        if ((rowClassName === className || className === " " || (className === "" && rowClassName === "-"))
            && rowStudentName.includes(studentName))
            $(this).show();
        else $(this).hide();
    });
}

function addParentToParentsList() {
    if ($("#parentFullnameInput").is(':disabled')) {
        alert("No se ha encontrado un padre con ese número de teléfono");
        return;
    }

    if ($("#addedParentsList #" + $("#parentTelephoneInput").val()).length > 0 ||
        $("#parentsTable td:first-child:contains('" + $("#parentTelephoneInput").val() + "')").length > 0) {
        alert("El padre ya ha sido añadido");
        return;
    }

    $("#addedParentsList").append("<li id='" + $("#parentTelephoneInput").val() + "'>" + $("#parentFullnameInput").val() + "<a class='deleteCross' onclick='deleteParentFromParentsList(this)'>&times;</a></li>");
}

function deleteParentFromParentsList(button) {
    button.parentNode.remove();
}

function registerStudent() {
    var studentName = $("#studentNameInput").val()
    var studentSurname = $("#studentSurnameInput").val()
    var studentClass = $("#classDropdown :selected").val();

    if (studentName.trim() === "" || studentSurname.trim() === "") {
        alert("Rellene todos los campos");
        return;
    }

    postCall("/centre/students/register",
        {"studentName": studentName, "studentSurname": studentSurname, "studentClass": studentClass},
        registerStudentCallback
    );

}

function registerStudentCallback(response) {
    if (!response.registered) {
        alert("Error al registrar al estudiante");
        return;
    }

    $("#studentsTable").append(
        "<tr>" +
        "<td>" + response.studentSurname + ", " + response.studentName + "</td>" +
        "<td>" + response.studentClass + "</td>" +
        "<td class='tableButton'><button class='infoButton'><a href='student?id=" + response.studentId + "'>Ver</a></button></td>" +
        "</tr>"
    );

    addParents(response.studentId);
    closeModal();
}

$(".modal-body_content #parentTelephoneInput").on('input', function () {
    var parentTelephone = $(this).val();

    if (isNaN(parentTelephone) || parentTelephone.length !== 9) {
        $("#parentFullnameInput").prop("disabled", true);
        $("#parentFullnameInput").val("");
        return;
    }

    getCall("/centre/students/findParent?parentTelephone=" + parentTelephone,
        searchParentByTelephoneCallback
    );
});

// function searchParentByTelephone() {
//     parentTelephone = $("#parentTelephoneInput").val();
//
//     if (isNaN(parentTelephone) || parentTelephone.length !== 9) {
//         $("#parentFullnameInput").prop("disabled", true);
//         $("#parentFullnameInput").val("");
//         return;
//     }
//
//     getCall("/centre/students/findParent?parentTelephone=" + parentTelephone,
//         searchParentByTelephoneCallback
//     )
// }

function searchParentByTelephoneCallback(response) {
    if (response.found) {
        $("#parentTelephoneInput").val(response.parentTelephone);
        $("#parentFullnameInput").val(response.parentFullname);
        $("#parentFullnameInput").prop("disabled", false);
    } else {
        $("#parentFullnameInput").prop("disabled", true);
        $("#parentFullnameInput").val("");
    }
}

// STUDENT
function openEditStudentDialog() {
    $("#studentNameInput").val($("#studentName").text());
    $("#studentSurnameInput").val($("#studentSurname").text());

    $("#classDropdown option").each(function () {
        if ($(this).text() === $("#studentClass").text()) $(this).prop('selected', true);
        // else $(this).prop('selected', false);
    });

    $("#editStudentModal").show();
}

function openAddParentDialog() {
    $("#parentTelephoneInput").val("");
    $("#parentFullnameInput").val("");
    $("#addParentModal #parentFullnameInput").prop("disabled", true);
    $("#addedParentsList").empty();
    $("#addParentModal").show();
}

// function openEditParentDialog(button) {
//     parentTelephone = $(button).parent().parent().children().eq(0).text();
//     parentFullname = $(button).parent().parent().children().eq(1).text();
//     $("#editParentModal #parentTelephoneInput").val(parentTelephone);
//     $("#editParentModal #parentFullnameInput").val(parentFullname);
//     $("#editParentModal").show();
// }

function editStudent(studentId) {
    var studentName = $("#studentNameInput").val()
    var studentSurname = $("#studentSurnameInput").val()
    var studentClass = $("#classDropdown :selected").val();

    if (studentName.trim() === "" || studentSurname.trim() === "") {
        alert("Rellene todos los campos");
        return;
    }

    postCall("/centre/student/edit",
        {
            "studentId": studentId,
            "studentName": studentName,
            "studentSurname": studentSurname,
            "studentClass": studentClass
        },
        editStudentCallback
    );

}

function editStudentCallback(response) {
    if (!response.edited) {
        alert("Error al editar el alumno");
        return;
    }

    $("#studentFullName").text(response.studentName + " " + response.studentSurname);
    $("#studentName").text(response.studentName);
    $("#studentSurname").text(response.studentSurname);
    $("#studentClass").text(response.studentClass);
    closeModal();
}

function deleteStudent(studentId) {
    if (!confirm("¿Está seguro de que desea eliminar al alumno?")) return;

    postCall("/centre/student/delete",
        {"studentId": studentId},
        deleteStudentCallback
    );
}

function deleteStudentCallback(response) {
    if (!response.deleted) {
        alert("Error al eliminar al alumno");
        return;
    }

    window.location.replace("students");
}

function addParents(studentId) {
    var parentsTelephones = [];

    $("#addedParentsList li").each(function () {
        parentsTelephones.push($(this).attr('id'));
    });

    for (var i = 0; i < parentsTelephones.length; i++) {
        postCall("/centre/students/addParent",
            {"studentId": studentId, "parentTelephone": parentsTelephones[i]},
            addParentsCallback
        );
    }
}

function addParentsCallback(response) {
    if (!response.added) {
        alert("Error al añadir al padre");
        return;
    }

    $("#parentsTable").append(
        "<tr id='" + response.addedParentId + "'>" +
        "<td>" + response.addedParentTelephone + "</td>" +
        "<td>" + response.addedParentFullname + "</td>" +
        // "<td class='tableButton'><button class='primaryButton' onclick='openEditParentDialog(this)'>Editar</button></td>" +
        "<td class='tableButton'><button class='warningButton' onclick='deleteParent(" + response.studentId + "," + response.addedParentId + ")'>Eliminar</button></td>" +
        "</tr>"
    );

    closeModal();
}

// function editParent(id) {
//     parentTelephone = $("#editParentModal  #parentTelephoneInput").val();
//     parentFullname = $("#editParentModal #parentFullnameInput").val();
//
//     if (parentFullname.trim() === "" || parentTelephone.trim() === "") alert("Rellene todos los campos");
//     else if (isNaN(parentTelephone)) alert("El número de teléfono tiene un formato incorrecto");
//     else {
//         //para saber el id te la fila, establecerlo en el parámetro del onclick al abrir el diálogo
//         closeModal();
//     }
// }

function deleteParent(studentId, parentId) {
    if (!confirm("¿Está seguro de que desea eliminar al padre?")) return;

    postCall("/centre/student/deleteParent",
        {"studentId": studentId, "parentId": parentId},
        deleteParentCallback
    );
}

function deleteParentCallback(response) {
    if (!response.deleted) {
        alert("Error al eliminar el padre");
        return;
    }

    $("#parentsTable #" + response.deletedParentId).remove();
}

// --------------------MESSAGING--------------------
// CIRCULARS
function openSendCircularDialog() {
    $("#circularSubjectInput").val("");
    $("#circularContentTextArea").val("");
    resetTreeview("#sendCircularModal");
    $("#sendCircularModal").show();
}

function openViewCircularDialog(circularId) {
    setViewCircularDialogInfo(circularId);
}

function setViewCircularDialogInfo(circularId) {
    getCall("/messaging/circulars/getCircular?id=" + circularId, setViewCircularDialogInfoCallback);
}

function setViewCircularDialogInfoCallback(response) {
    if (!response.found) {
        alert("Error al obtener los datos de la circular");
        return;
    }

    $("#viewCircularModal .modalTitle").text(response.circularSubject + " (" + dateToString(response.circularSendingDate.date) + ")");
    $("#viewCircularModal .messageTextArea").text(response.circularMessage);

    $("#viewCircularModal").show();
}

function filterCirculars() {
    var circularSubject = $("#circularSubjectInputFilter").val().toLowerCase();
    var circularMonth = $("#circularMonthDropdown :selected").val();
    $("#circularsTable > tbody > tr").each(function () {
        var rowCircularSubject = $(this).children().eq(1).text().toLowerCase();
        var rowCircularMonth = $(this).children().eq(0).text().substring(3, 5);
        if (rowCircularSubject.includes(circularSubject) && (rowCircularMonth === circularMonth || circularMonth === "")) $(this).show();
        else $(this).hide();
    });
}

function sendCircular(centreId) {
    if ($("#circularSubjectInput").val().trim() === "") alert("El asunto de la circular no debe estar vacío");
    else
        postCall("/messaging/circulars/sendCircular",
            {
                "subject": $("#circularSubjectInput").val(),
                "message": $("#circularContentTextArea").val(),
            },
            sendCircularCallback
        );
}

function sendCircularCallback(response) {
    if (!response.sent) {
        alert("Error al enviar la circular");
        return;
    }

    $("#circularsTable tbody").prepend(
        "<tr>" +
        "<td>" + getTodaysDate() + "</td>" +
        "<td>" + response.sentCircularSubject + "</td>" +
        "<td class='tableButton'><button class='infoButton' onclick='openViewCircularDialog(" + response.sentCircularId + ")'>Ver</button></td>" +
        "</tr>"
    );
    closeModal();
}

// AUTHORIZATIONS
function openSendAuthorizationDialog() {
    $("#authorizationSubjectInput").val("");
    $("#authorizationDateInput").val("");
    $("#authorizationContentTextArea").val("");
    resetTreeview("#sendAuthorizationModal");
    $("#sendAuthorizationModal").show();
}

function openViewAuthorizationDialog() {
    $("#viewAuthorizationModal").show();
}

function sendAuthorization() {
    if ($("#authorizationSubjectInput").val().trim() === "" || $("#authorizationDateInput").val().trim() === "") alert("El asunto y la fecha límite de la circular no deben estar vacíos");
    else if (dateComparator(dateToString($("#authorizationDateInput").val()), getTodaysDate()) === -1) alert("La fecha límite es anterior a la actual");
    else {

        $("#authorizationsTable tbody").prepend(
            "<tr>" +
            "<td>" + getTodaysDate() + "</td>" +
            "<td>" + $("#authorizationSubjectInput").val() + "</td>" +
            "<td>" + dateToString($("#authorizationDateInput").val()) + "</td>" +
            "<td class='tableButton'><button class='infoButton' onclick='openViewAuthorizationDialog()'>Ver</button></td>" +
            "</tr>"
        );
        closeModal();
    }
}

function filterAuthorizations() {
    var authorizationSubject = $("#authorizationSubjectInputFilter").val().toLowerCase();
    var authorizationMonth = $("#authorizationMonthDropdownFilter :selected").val();
    var authorizationState = parseInt($("#authorizationStateDropdownFilter :selected").val());
    $("#authorizationsTable > tbody > tr").each(function () {
        var rowAuthorizationState = dateComparator($(this).children().eq(2).text(), getTodaysDate());
        var rowAuthorizationSubject = $(this).children().eq(1).text().toLowerCase();
        var rowAuthorizationMonth = $(this).children().eq(0).text().substring(3, 5);
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
    resetTreeview("#sendPollModal");
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
    else if (dateComparator(dateToString($("#pollDateInput").val()), getTodaysDate()) === -1) alert("La fecha límite es anterior a la actual");
    else {

        $("#pollsTable tbody").prepend(
            "<tr>" +
            "<td>" + getTodaysDate() + "</td>" +
            "<td>" + $("#pollSubjectInput").val() + "</td>" +
            "<td>" + dateToString($("#pollDateInput").val()) + "</td>" +
            "<td class='tableButton'><button class='infoButton' onclick='openViewPollDialog()'>Ver</button></td>" +
            "</tr>"
        );
        closeModal();
    }
}

function filterPolls() {
    var pollSubject = $("#pollSubjectInputFilter").val().toLowerCase();
    var pollMonth = $("#pollMonthDropdownFilter :selected").val();
    var pollState = parseInt($("#pollStateDropdownFilter :selected").val());
    $("#pollsTable > tbody > tr").each(function () {
        var rowPollState = dateComparator($(this).children().eq(2).text(), getTodaysDate());
        var rowPollSubject = $(this).children().eq(1).text().toLowerCase();
        var rowPollMonth = $(this).children().eq(0).text().substring(3, 5);
        if (rowPollSubject.includes(pollSubject) &&
            (rowPollMonth === pollMonth || pollMonth === "") &&
            (rowPollState === pollState || pollState === 0)) $(this).show();
        else $(this).hide();
    });
}