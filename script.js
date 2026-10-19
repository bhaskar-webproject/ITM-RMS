"use strict";


/* =================================================
   STORAGE
================================================= */

const STORAGE_KEY = "ITM_RESULT_STUDENTS";


/* =================================================
   DEFAULT STUDENT DATA
================================================= */

const defaultStudents = [

    {
        id: "1",

        rollNo: "2401200100058",

        studentName: "Harsh Kumar Singh",

        dob: "2005-05-15",

        course: "B.Tech",

        branch: "CSE",

        semester: "5th",

        marks: {

            web: 92,

            daa: 95,

            dbms: 88,

            oosd: 90,

            network: 98

        }
    },


    {
        id: "2",

        rollNo: "2401200100047",

        studentName: "Ayush Mishra",

        dob: "2005-07-20",

        course: "B.Tech",

        branch: "CSE",

        semester: "5th",

        marks: {

            web: 85,

            daa: 82,

            dbms: 80,

            oosd: 86,

            network: 88

        }
    }

];



/* =================================================
   SUBJECT LIST
================================================= */

const subjects = [

    {
        key: "web",
        name: "Web Technology"
    },

    {
        key: "daa",
        name: "DAA"
    },

    {
        key: "dbms",
        name: "DBMS"
    },

    {
        key: "oosd",
        name: "OOSD with C++"
    },

    {
        key: "network",
        name: "Computer Network"
    }

];



/* =================================================
   GET STUDENTS
================================================= */

function getStudents() {

    const savedData =
        localStorage.getItem(STORAGE_KEY);


    if (!savedData) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(defaultStudents)
        );

        return defaultStudents;

    }


    try {

        return JSON.parse(savedData);

    } catch (error) {

        console.error(error);

        return [];

    }

}



/* =================================================
   SAVE STUDENTS
================================================= */

function saveStudents(students) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(students)
    );

}



/* =================================================
   CALCULATE RESULT
================================================= */

function calculateResult(student) {

    let total = 0;

    let fail = false;


    subjects.forEach(subject => {

        const mark =
            Number(student.marks[subject.key]);

        total += mark;


        if (mark < 33) {

            fail = true;

        }

    });


    const maximum =
        subjects.length * 100;


    const percentage =
        (total / maximum) * 100;


    return {

        total: total,

        maximum: maximum,

        percentage:
            percentage.toFixed(2),

        status:
            fail ? "FAIL" : "PASS"

    };

}



/* =================================================
   GRADE
================================================= */

function getGrade(mark) {

    mark = Number(mark);


    if (mark >= 90) return "A+";

    if (mark >= 80) return "A";

    if (mark >= 70) return "B+";

    if (mark >= 60) return "B";

    if (mark >= 50) return "C";

    if (mark >= 40) return "D";

    if (mark >= 33) return "E";

    return "F";

}



/* =================================================
   ADMIN LOGIN
================================================= */

const adminLoginForm =
    document.getElementById("adminLoginForm");


if (adminLoginForm) {


    adminLoginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const username =
                document
                .getElementById("username")
                .value
                .trim();


            const password =
                document
                .getElementById("password")
                .value;


            const message =
                document
                .getElementById(
                    "adminLoginMessage"
                );


            if (
                username === "admin" &&
                password === "admin@123"
            ) {


                sessionStorage.setItem(
                    "adminLoggedIn",
                    "true"
                );


                window.location.href =
                    "admin-dashboard.html";


            } else {


                message.textContent =
                    "Invalid username or password.";

            }

        }
    );

}



/* =================================================
   ADMIN DASHBOARD
================================================= */

const studentForm =
    document.getElementById("studentForm");


if (studentForm) {


    /* CHECK LOGIN */

    if (
        sessionStorage.getItem(
            "adminLoggedIn"
        ) !== "true"
    ) {

        window.location.replace(
            "admin-login.html"
        );

    }


    const tableBody =
        document.getElementById(
            "studentTableBody"
        );


    const searchInput =
        document.getElementById(
            "searchRoll"
        );


    const adminMessage =
        document.getElementById(
            "adminMessage"
        );


    let searchText = "";



    /* =========================================
       DISPLAY STUDENTS
    ========================================= */

    function displayStudents() {


        const students =
            getStudents();


        const filtered =
            students.filter(student =>

                student.rollNo
                    .toLowerCase()
                    .includes(
                        searchText.toLowerCase()
                    )

            );


        tableBody.innerHTML = "";


        if (filtered.length === 0) {

            tableBody.innerHTML = `

                <tr>

                    <td colspan="7"
                        style="text-align:center">

                        No student record found.

                    </td>

                </tr>

            `;

            return;

        }



        filtered.forEach(student => {


            const result =
                calculateResult(student);


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${student.rollNo}
                </td>

                <td>
                    ${student.studentName}
                </td>

                <td>
                    ${student.course}
                </td>

                <td>
                    ${student.branch}
                </td>

                <td>
                    ${student.semester}
                </td>

                <td>
                    ${result.percentage}%
                </td>

                <td>

                    <button
                        class="action-button edit-button"
                        data-action="edit"
                        data-id="${student.id}">

                        Edit

                    </button>


                    <button
                        class="action-button delete-button"
                        data-action="delete"
                        data-id="${student.id}">

                        Delete

                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        });

    }



    /* =========================================
       CLEAR FORM
    ========================================= */

    function clearForm() {


        studentForm.reset();


        document.getElementById(
            "editId"
        ).value = "";


        document.getElementById(
            "formTitle"
        ).textContent =
            "Add New Student";


        document.getElementById(
            "saveStudent"
        ).textContent =
            "Save Student";


        document.getElementById(
            "course"
        ).value = "B.Tech";


        document.getElementById(
            "branch"
        ).value = "CSE";


        document.getElementById(
            "webMarks"
        ).value = "";


        document.getElementById(
            "daaMarks"
        ).value = "";


        document.getElementById(
            "dbmsMarks"
        ).value = "";


        document.getElementById(
            "oosdMarks"
        ).value = "";


        document.getElementById(
            "networkMarks"
        ).value = "";

    }



    /* =========================================
       EDIT STUDENT
    ========================================= */

    function editStudent(id) {


        const students =
            getStudents();


        const student =
            students.find(
                s => s.id === id
            );


        if (!student) {

            return;

        }


        document.getElementById(
            "editId"
        ).value =
            student.id;


        document.getElementById(
            "rollNo"
        ).value =
            student.rollNo;


        document.getElementById(
            "studentName"
        ).value =
            student.studentName;


        document.getElementById(
            "dob"
        ).value =
            student.dob;


        document.getElementById(
            "course"
        ).value =
            student.course;


        document.getElementById(
            "branch"
        ).value =
            student.branch;


        document.getElementById(
            "semester"
        ).value =
            student.semester;


        document.getElementById(
            "webMarks"
        ).value =
            student.marks.web;


        document.getElementById(
            "daaMarks"
        ).value =
            student.marks.daa;


        document.getElementById(
            "dbmsMarks"
        ).value =
            student.marks.dbms;


        document.getElementById(
            "oosdMarks"
        ).value =
            student.marks.oosd;


        document.getElementById(
            "networkMarks"
        ).value =
            student.marks.network;


        document.getElementById(
            "formTitle"
        ).textContent =
            "Edit Student";


        document.getElementById(
            "saveStudent"
        ).textContent =
            "Update Student";


        studentForm.scrollIntoView({
            behavior: "smooth"
        });

    }



    /* =========================================
       ADD / UPDATE
    ========================================= */

    studentForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const editId =
                document.getElementById(
                    "editId"
                ).value;


            const rollNo =
                document.getElementById(
                    "rollNo"
                ).value.trim();


            const studentName =
                document.getElementById(
                    "studentName"
                ).value.trim();


            const dob =
                document.getElementById(
                    "dob"
                ).value;


            const course =
                document.getElementById(
                    "course"
                ).value.trim();


            const branch =
                document.getElementById(
                    "branch"
                ).value.trim();


            const semester =
                document.getElementById(
                    "semester"
                ).value;


            const marks = {

                web: Number(
                    document.getElementById(
                        "webMarks"
                    ).value
                ),

                daa: Number(
                    document.getElementById(
                        "daaMarks"
                    ).value
                ),

                dbms: Number(
                    document.getElementById(
                        "dbmsMarks"
                    ).value
                ),

                oosd: Number(
                    document.getElementById(
                        "oosdMarks"
                    ).value
                ),

                network: Number(
                    document.getElementById(
                        "networkMarks"
                    ).value
                )

            };



            /* VALIDATION */

            if (
                !rollNo ||
                !studentName ||
                !dob ||
                !course ||
                !branch ||
                !semester
            ) {

                adminMessage.textContent =
                    "Please fill all fields.";

                return;

            }



            const invalidMarks =
                Object.values(marks).some(
                    mark =>
                        mark < 0 ||
                        mark > 100 ||
                        !Number.isFinite(mark)
                );


            if (invalidMarks) {

                adminMessage.textContent =
                    "Marks must be between 0 and 100.";

                return;

            }



            const students =
                getStudents();


            /* DUPLICATE ROLL */

            const duplicate =
                students.some(student =>

                    student.rollNo
                        .toLowerCase() ===
                    rollNo.toLowerCase() &&

                    student.id !== editId

                );


            if (duplicate) {

                adminMessage.textContent =
                    "Roll number already exists.";

                return;

            }



            /* NEW OBJECT */

            const newStudent = {

                id:
                    editId ||
                    Date.now().toString(),

                rollNo:

                    rollNo,

                studentName:

                    studentName,

                dob:

                    dob,

                course:

                    course,

                branch:

                    branch,

                semester:

                    semester,

                marks:

                    marks

            };



            if (editId) {


                const index =
                    students.findIndex(
                        student =>
                            student.id === editId
                    );


                if (index !== -1) {

                    students[index] =
                        newStudent;

                }


                adminMessage.textContent =
                    "Student record updated successfully.";

            }

            else {


                students.push(
                    newStudent
                );


                adminMessage.textContent =
                    "New student added successfully.";

            }



            saveStudents(students);


            clearForm();


            searchText = "";


            searchInput.value = "";


            displayStudents();

        }
    );



    /* =========================================
       SEARCH
    ========================================= */

    document
        .getElementById("searchBtn")
        .addEventListener(
            "click",
            function() {

                searchText =
                    searchInput.value.trim();


                displayStudents();


                if (!searchText) {

                    adminMessage.textContent =
                        "Showing all students.";

                    return;

                }


                const found =
                    getStudents().some(
                        student =>

                            student.rollNo
                                .toLowerCase()
                                .includes(
                                    searchText
                                        .toLowerCase()
                                )
                    );


                adminMessage.textContent =
                    found
                        ? "Student record found."
                        : "Roll number not found.";

            }
        );



    /* ENTER SEARCH */

    searchInput.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                event.preventDefault();

                document
                    .getElementById(
                        "searchBtn"
                    )
                    .click();

            }

        }
    );



    /* SHOW ALL */

    document
        .getElementById("resetSearch")
        .addEventListener(
            "click",
            function() {

                searchText = "";

                searchInput.value = "";

                adminMessage.textContent = "";

                displayStudents();

            }
        );



    /* CLEAR */

    document
        .getElementById("clearForm")
        .addEventListener(
            "click",
            function() {

                clearForm();

                adminMessage.textContent = "";

            }
        );



    /* =========================================
       EDIT / DELETE ACTION
    ========================================= */

    tableBody.addEventListener(
        "click",
        function(event) {


            const button =
                event.target.closest(
                    "button[data-action]"
                );


            if (!button) {

                return;

            }


            const id =
                button.dataset.id;


            /* EDIT */

            if (
                button.dataset.action ===
                "edit"
            ) {

                editStudent(id);

            }



            /* DELETE */

            if (
                button.dataset.action ===
                "delete"
            ) {


                const students =
                    getStudents();


                const student =
                    students.find(
                        s => s.id === id
                    );


                if (!student) {

                    return;

                }


                const confirmDelete =
                    confirm(
                        "Delete " +
                        student.studentName +
                        " (" +
                        student.rollNo +
                        ")?"
                    );


                if (!confirmDelete) {

                    return;

                }


                const updatedStudents =
                    students.filter(
                        s => s.id !== id
                    );


                saveStudents(
                    updatedStudents
                );


                displayStudents();


                adminMessage.textContent =
                    "Student deleted successfully.";

            }

        }
    );



    /* =========================================
       ADMIN LOGOUT
    ========================================= */

    document
        .getElementById("adminLogout")
        .addEventListener(
            "click",
            function() {

                sessionStorage.removeItem(
                    "adminLoggedIn"
                );

                window.location.href =
                    "admin-login.html";

            }
        );



    /* INITIAL DISPLAY */

    displayStudents();

}



/* =================================================
   STUDENT LOGIN
================================================= */

const studentLoginForm =
    document.getElementById(
        "studentLoginForm"
    );


if (studentLoginForm) {


    studentLoginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const rollNo =
                document
                .getElementById(
                    "studentRoll"
                )
                .value
                .trim();


            const dob =
                document
                .getElementById(
                    "studentDob"
                )
                .value;


            const message =
                document
                .getElementById(
                    "studentLoginMessage"
                );


            const students =
                getStudents();


            const student =
                students.find(
                    student =>

                        student.rollNo
                            .toLowerCase() ===
                        rollNo.toLowerCase()

                        &&

                        student.dob === dob
                );


            if (!student) {

                message.textContent =
                    "Invalid Roll Number or Date of Birth.";

                return;

            }


            /* SAVE LOGIN STUDENT */

            sessionStorage.setItem(
                "studentRoll",
                student.rollNo
            );


            /* OPEN RESULT */

            window.location.href =
                "student-dashboard.html";

        }
    );

}



/* =================================================
   STUDENT RESULT
================================================= */

const resultCard =
    document.getElementById(
        "resultCard"
    );


if (resultCard) {


    const rollNo =
        sessionStorage.getItem(
            "studentRoll"
        );


    const students =
        getStudents();


    const student =
        students.find(
            student =>
                student.rollNo === rollNo
        );



    /* NO STUDENT */

    if (!student) {


        resultCard.innerHTML = `

            <div style="text-align:center">

                <img
                    src="college-logo.png"
                    class="login-logo"
                    alt="ITM Logo"
                >

                <h2>
                    Result Not Found
                </h2>

                <p>
                    Please login again.
                </p>

                <a
                    href="student-login.html"
                    class="blue-button">

                    Student Login

                </a>

            </div>

        `;

    }

    else {


        /* RESULT */

        const result =
            calculateResult(student);



        /* STUDENT DETAILS */

        const detailsHTML = `

     <div class="result-detail">

        <div>
            <strong>STUDENT NAME</strong>
            <br>
            ${student.studentName}
        </div>

        <div>
            <strong>ROLL NUMBER</strong>
            <br>
            ${student.rollNo}
        </div>

        <div>
            <strong>COURSE</strong>
            <br>
            ${student.course}
        </div>

        <div>
            <strong> BRANCH </strong>
            <br>
            ${student.branch}
        </div>

    </div>


    <div class="result-detail">

        <div>
            <strong>SEMESTER</strong>
            <br>
            ${student.semester}
        </div>

        <div>
            <strong>STATUS</strong>
            <br>

            <b class="${result.status === "PASS" ? "pass" : "fail"}">
                ${result.status}
            </b>

        </div>

        <div></div>
        <div></div>

    </div>

`;


        document.getElementById(
            "resultDetails"
        ).innerHTML =
            detailsHTML;



        /* SUBJECT MARKS */

        const marksBody =
            document.getElementById(
                "resultMarks"
            );


        marksBody.innerHTML = "";


        subjects.forEach(
            subject => {


                const mark =
                    Number(
                        student.marks[
                            subject.key
                        ]
                    );


                const grade =
                    getGrade(mark);


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${subject.name}
                    </td>

                    <td>
                        100
                    </td>

                    <td>
                        <strong>
                            ${mark}
                        </strong>
                    </td>

                    <td>
                        ${grade}
                    </td>

                `;


                marksBody.appendChild(row);

            }
        );



        /* SUMMARY */

        document.getElementById(
            "resultSummary"
        ).innerHTML = `

            <div class="summary-item">

                <strong>TOTAL MARKS</strong>

                <span>
                    ${result.total} /${result.maximum}
                </span>

            </div>

            <div class="summary-item">

                <strong> PERCENTAGE </strong>

                <span>
                    ${result.percentage}%
                </span>

            </div>

            <div class="summary-item">

                <strong> RESULT </strong>

                <span class="${
                    result.status === "PASS"
                    ? "pass"
                    : "fail"
                }">
                    ${result.status}
                </span>

            </div>

        `;



        /* DECLARATION DATE */

        document.getElementById(
            "declarationDate"
        ).textContent =
            new Date()
            .toLocaleDateString(
                "en-IN"
            );

    }



    /* =========================================
       PRINT
    ========================================= */

    const printButton =
        document.getElementById(
            "printResult"
        );


    if (printButton) {

        printButton.addEventListener(
            "click",
            function() {

                window.print();

            }
        );

    }



    /* =========================================
       STUDENT LOGOUT
    ========================================= */

    const logoutButton =
        document.getElementById(
            "studentLogout"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function() {

                sessionStorage.removeItem(
                    "studentRoll"
                );


                window.location.href =
                    "student-login.html";

            }
        );

    }

}



/* =================================================
   DATE FORMAT
================================================= */

function formatDate(dateString) {

    if (!dateString) {

        return "";

    }


    const parts =
        dateString.split("-");


    if (parts.length !== 3) {

        return dateString;

    }


    return (
        parts[2] +
        "-" +
        parts[1] +
        "-" +
        parts[0]
    );

}