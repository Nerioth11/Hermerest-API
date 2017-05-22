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

    autoimportClass(currentClass, currentStudents);
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
    if (!response.success) {
        alert(response.error);
        return;
    }

    $("#classesTable").append(
        "<tr>" +
        "<td>" + response.content.name + "</td>" +
        "<td>" + response.content.students + "</td>" +
        "<td class='tableButton'><button class='infoButton'><a href='class?id=" + response.content.id + "'>Ver</a></button></td>" +
        "</tr>"
    );
}


function openNewClassDialog() {
    $("#classNameInput").val("");
    $("#studentNameFilterInput").val("");
    $("#addedStudentsList li").each(function () {
        $("#studentsDropdown").append("<option value='" + $(this).attr('id') + "'>" + $(this).text().slice(0, -1) + "</option>");
    });
    $("#addedStudentsList").empty();
    hideNotMatchingStudentsFromStudentsDropdown();
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
    if (!response.success) {
        alert(response.error);
        return;
    }
    $("#classesTable").append(
        "<tr>" +
        "<td>" + response.content.name + "</td>" +
        "<td>0</td>" +
        "<td class='tableButton'><button class='infoButton' onclick='window.location.href=\"class?id=" + response.content.id + "\"'>Ver</button></td>" +
        "</tr>"
    );

    addStudentsToClass(response.content.id, addStudentsToClassCallback);
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
    if (!response.success) {
        alert(response.error);
        return;
    }
    $("#className").text(response.content.name);
    closeModal();
}

function deleteStudentFromClass(studentId) {
    postCall("/centre/class/deleteStudent",
        {"studentId": studentId},
        deleteStudentFromClassCallback
    );
}

function deleteStudentFromClassCallback(response) {
    if (!response.success) {
        alert(response.error);
        return;
    }

    $("#studentsTable #" + response.content.id).remove();
    $("#studentsDropdown").append(
        "<option value='" + response.content.id + "'>" +
        response.content.surname + ", " + response.content.name +
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

function addStudentsToClass(classId, callback) {
    var studentsIds = [];
    $("#addedStudentsList li").each(function () {
        studentsIds.push($(this).attr('id'));
    });


    if (studentsIds.length === 0 && callback !== addStudentsToClassCallback) {
        alert("Seleccione algún alumno");
        return;
    }

    if (studentsIds.length === 0 && callback === addStudentsToClassCallback) {
        closeModal();
        return;
    }

    for (var i = 0; i < studentsIds.length; i++) {
        postCall("/centre/class/addStudent",
            {"studentId": studentsIds[i], "classId": classId},
            callback
        );
    }
}

function addStudentsToClassAndShowItCallback(response) {
    if (!response.success) {
        alert(response.error);
        return;
    }

    $("#studentsTable").append(
        "<tr id='" + response.content.id + "'>" +
        "<td>" + response.content.surname + ", " + response.content.name + "</td>" +
        "<td class='tableButton'><button class='infoButton' onclick='window.location.href=\"student?id=" + response.content.id + "\"'>Ver</button></td>" +
        "<td class='tableButton'><button class='warningButton' onclick='deleteStudentFromClass(" + response.content.id + ")'>Eliminar</button></td>" +
        "</tr>"
    );

    $("#studentsDropdown [value='" + response.content.id + "']").remove();
    $("#numberOfStudents").text(parseInt($("#numberOfStudents").text()) + 1);
    closeModal();
}

function addStudentsToClassCallback(response) {
    if (!response.success) {
        alert(response.error);
        return;
    }
    var numberOfStudentsOfCurrentClass = parseInt($("#classesTable tr").last().children().eq(1).text());
    $("#classesTable tr td:first-child").each(function () {
        if ($(this).text() === response.content.oldClassName) {
            $(this).next().text(parseInt($(this).next().text()) - 1);
            return;
        }
    });
    $("#classesTable tr").last().children().eq(1).text(numberOfStudentsOfCurrentClass + 1);
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
    if (!response.success) {
        alert(response.error);
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
    if (!response.success) {
        alert(response.error);
        return;
    }

    $("#studentsTable").append(
        "<tr>" +
        "<td>" + response.content.surname + ", " + response.content.name + "</td>" +
        "<td>" + response.content.class + "</td>" +
        "<td class='tableButton'><button class='infoButton' onclick='window.location.href=\"student?id=" + response.content.id + "\"'>Ver</button></td>" +
        "</tr>"
    );

    addParents(response.content.id);
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

function searchParentByTelephoneCallback(response) {
    if(!response.success){
        alert(response.error);
        return;
    }

    if (response.content.found) {
        $("#parentTelephoneInput").val(response.content.telephone);
        $("#parentFullnameInput").val(response.content.fullname);
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
    if (!response.success) {
        alert(response.error);
        return;
    }

    $("#studentFullName").text(response.content.name + " " + response.content.surname);
    $("#studentName").text(response.content.name);
    $("#studentSurname").text(response.content.surname);
    $("#studentClass").text(response.content.class);
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
    if (!response.success) {
        alert(response.error);
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
    if (!response.success) {
        alert(response.error);
        return;
    }

    $("#parentsTable").append(
        "<tr id='" + response.content.id + "'>" +
        "<td>" + response.content.telephone + "</td>" +
        "<td>" + response.content.fullname + "</td>" +
        "<td class='tableButton'><button class='warningButton' onclick='deleteParent(" + response.studentId + "," + response.content.id + ")'>Eliminar</button></td>" +
        "</tr>"
    );

    closeModal();
}

function deleteParent(studentId, parentId) {
    if (!confirm("¿Está seguro de que desea eliminar al padre?")) return;

    postCall("/centre/student/deleteParent",
        {"studentId": studentId, "parentId": parentId},
        deleteParentCallback
    );
}

function deleteParentCallback(response) {
    if (!response.success) {
        alert(response.error);
        return;
    }

    $("#parentsTable #" + response.content.id).remove();
}