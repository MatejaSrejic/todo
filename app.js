function* entries(obj) {
    for (let key of Object.keys(obj)) {
      yield [key, obj[key]];
    }  
}

let tasks;
let finished;
let currentId;
let currentFinishedId;

window.addEventListener("load", function(){
    if (localStorage.getItem("tasks") == null) {
        tasks = {};
        finished = {};
        currentId = 0;
        currentFinishedId = 0;
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
        finished = JSON.parse(localStorage.getItem('finished'));
        currentId = Number(localStorage.getItem('currId'));
        currentFinishedId = Number(localStorage.getItem('currFinId'));
    }
    for (let [key, value] of entries(tasks)) {
        document.querySelector(".tasksList").innerHTML += generateHTML(value, key);
    }
    for (let [key, value] of entries(finished)) {
        document.querySelector(".completedTasksList").innerHTML += generateCompletedHTML(value, key);
    }
    showAndHide();
});

function save() {
    logDebug();
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('finished', JSON.stringify(finished));
    localStorage.setItem('currId', currentId);
    localStorage.setItem('currFinId', currentFinishedId);
}

function logDebug() {
    console.log("Tasks ("+currentId+"): "+JSON.stringify(tasks));
    console.log("Finished ("+currentFinishedId+"): "+JSON.stringify(finished));
}

function showAndHide() {
    if ($.isEmptyObject(tasks) && $.isEmptyObject(finished)) {
        document.querySelector(".noTasks").style.display = "flex";
        document.querySelector(".toDoH2").style.display = "none";
        document.querySelector(".completedH2").style.display = "none";
    } else if (!$.isEmptyObject(tasks) && $.isEmptyObject(finished)) {
        document.querySelector(".noTasks").style.display = "none";
        document.querySelector(".toDoH2").style.display = "inline-block";
        document.querySelector(".completedH2").style.display = "none";
    } else if ($.isEmptyObject(tasks) && !$.isEmptyObject(finished)) {
        document.querySelector(".noTasks").style.display = "none";
        document.querySelector(".toDoH2").style.display = "none";
        document.querySelector(".completedH2").style.display = "inline-block";
    } else {
        document.querySelector(".noTasks").style.display = "none";
        document.querySelector(".toDoH2").style.display = "inline-block";
        document.querySelector(".completedH2").style.display = "inline-block";
    }
}

function generateHTML(title, id) {
    return '<div class=task id=task' + id + '><button class="btn checkbox"type=button onclick=finish('+id+')><i class="fa-solid fa-check"></i></button><div class=taskDetails>' + title + '</div><div class=taskToolbar><button class="btn editBtn"type=button><i class="fa-solid fa-pencil"></i></button> <button class="btn deleteBtn"type=button onclick=remove('+id+')><i class="fa-solid fa-trash"></i></button></div></div>';
}

function generateCompletedHTML(title, id) {
    return '<div class=completedTask id=completedTask' + id + '><button class="btn completedRestore"type=button onclick=restore('+id+')><i class="fa-solid fa-rotate-left"></i></button><div class=completedTaskDetails>'+title+'</div><div class=completedTaskToolbar><button class="btn completedEditBtn"type=button><i class="fa-solid fa-pencil"></i></button> <button class="btn completedDeleteBtn"type=button onclick=removeFinished('+id+')><i class="fa-solid fa-trash"></i></button></div></div>';
}

function addTask(details) {
    document.querySelector(".tasksList").innerHTML += generateHTML(details, currentId);
    tasks[currentId] = details;
    currentId++;
    save();
    showAndHide();
}

function remove(id) {
    delete tasks[id];
    document.querySelector("#task"+id).remove();
    save();
    showAndHide();
}

function finish(id) {
    finished[currentFinishedId] = tasks[id];
    document.querySelector(".completedTasksList").innerHTML += generateCompletedHTML(tasks[id], currentFinishedId);
    currentFinishedId++;
    remove(id);
    save();
}

function removeFinished(id) {
    delete finished[id];
    document.querySelector("#completedTask"+id).remove();
    save();
    showAndHide();
}

function restore(id) {
    tasks[currentId] = finished[id];
    document.querySelector(".tasksList").innerHTML += generateHTML(finished[id], currentId);
    currentId++;
    removeFinished(id);
    save();
}

document.querySelector(".addTaskBtn").addEventListener("click", function(){
    if (document.querySelector(".taskInput").value != "") {
        document.querySelector(".taskInput").style = "border: 0.5px solid rgb(227, 227, 227);;"
        addTask(document.querySelector(".taskInput").value);
        document.querySelector(".taskInput").value = "";
    } else {
        document.querySelector(".taskInput").style = "border: 0.5px solid red;"
    }
}); 

document.querySelector("#resetSess").addEventListener("click", function(){
    if (confirm("Proceed with the deletion of all tasks?")) {
        localStorage.clear();
        window.location.reload();
    }
});

function pressed(event) {
    if (event.keyCode == 13) {
        if (document.querySelector(".taskInput").value != "") {
            document.querySelector(".taskInput").style = "border: 0.5px solid rgb(227, 227, 227);;"
            addTask(document.querySelector(".taskInput").value);
            document.querySelector(".taskInput").value = "";
        } else {
            document.querySelector(".taskInput").style = "border: 0.5px solid red;"
        }
    }
}