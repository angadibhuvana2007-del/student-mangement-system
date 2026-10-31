
const studentForm = document.getElementById("studentForm");

const studentTable = document.getElementById("studentTable");

const searchInput = document.getElementById("searchInput");

const studentCount = document.getElementById("studentCount");

const message = document.getElementById("message");

const formTitle = document.getElementById("formTitle");

const submitBtn = document.getElementById("submitBtn");

const cancelBtn = document.getElementById("cancelBtn");

let students = JSON.parse(
    localStorage.getItem("students") || "[]"
);

let editingId = null;


// Save student records
function saveStudents() {
    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}


// Display student records
function displayStudents(searchText = "") {

    studentTable.innerHTML = "";

    const filteredStudents = students.filter(student => {

        return (
            student.name.toLowerCase().includes(
                searchText.toLowerCase()
            ) ||
            student.id.toLowerCase().includes(
                searchText.toLowerCase()
            )
        );

    });

    studentCount.textContent =
        "Total Students: " + students.length;

    if (filteredStudents.length === 0) {

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 6;
        cell.textContent = "No student records found.";

        row.appendChild(cell);
        studentTable.appendChild(row);

        return;
    }

    filteredStudents.forEach(student => {

        const row = document.createElement("tr");

        const values = [
            student.id,
            student.name,
            student.department,
            student.email,
            student.year
        ];

        values.forEach(value => {

            const cell = document.createElement("td");
            cell.textContent = value;

            row.appendChild(cell);

        });

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");

        editButton.textContent = "Edit";
        editButton.className = "edit-btn";
        editButton.dataset.action = "edit";
        editButton.dataset.id = student.id;

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.id = student.id;

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        studentTable.appendChild(row);

    });

}


// Add or Update Student
studentForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const id = document.getElementById("studentId").value.trim();

    const name = document.getElementById("studentName").value.trim();

    const department = document.getElementById("department").value;

    const email = document.getElementById("email").value.trim();

    const year = document.getElementById("year").value;

    const duplicate = students.some(student =>
        student.id.toLowerCase() === id.toLowerCase() &&
        student.id !== editingId
    );

    if (duplicate) {
        alert("Student ID already exists!");
        return;
    }

    const student = {
        id,
        name,
        department,
        email,
        year
    };

    if (editingId !== null) {

        students = students.map(item =>
            item.id === editingId ? student : item
        );

        message.textContent = "Student updated successfully!";

    } else {

        students.push(student);

        message.textContent = "Student added successfully!";

    }

    saveStudents();

    displayStudents(searchInput.value);

    studentForm.reset();

    resetEditMode();

});


// Edit or Delete Student
studentTable.addEventListener("click", function(event) {

    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = button.dataset.id;

    const action = button.dataset.action;

    const student = students.find(item => item.id === id);

    if (!student) return;

    if (action === "edit") {

        document.getElementById("studentId").value = student.id;

        document.getElementById("studentName").value = student.name;

        document.getElementById("department").value = student.department;

        document.getElementById("email").value = student.email;

        document.getElementById("year").value = student.year;

        editingId = student.id;

        formTitle.textContent = "Update Student";

        submitBtn.textContent = "Update Student";

        cancelBtn.hidden = false;

        message.textContent = "Editing student details.";

    }

    if (action === "delete") {

        if (confirm("Are you sure you want to delete this student?")) {

            students = students.filter(item => item.id !== id);

            saveStudents();

            displayStudents(searchInput.value);

            if (editingId === id) {
                studentForm.reset();
                resetEditMode();
            }

            message.textContent = "Student deleted successfully!";

        }

    }

});


// Search Students
searchInput.addEventListener("input", function() {

    displayStudents(this.value);

});


// Reset editing mode
function resetEditMode() {

    editingId = null;

    formTitle.textContent = "Add New Student";

    submitBtn.textContent = "Add Student";

    cancelBtn.hidden = true;

}


// Cancel edit
cancelBtn.addEventListener("click", function() {

    studentForm.reset();

    resetEditMode();

    message.textContent = "";

});


// Load saved student records
displayStudents();
