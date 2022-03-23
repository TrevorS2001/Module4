var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#task-to-do");
var taskInProgressEl = document.querySelector("#tasks-in-progress");
var taskCompletedEl = document.querySelector("#tasks-completed");

//select the id "page-content" from the main section in html
var pageContentEl = document.querySelector("#page-content");

var taskFormHandler = function(event) {

    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    
    //check if input values are empty strings
    if (!taskNameInput || !taskTypeInput){
        alert("You need to fill out the task form!");
        return false;
    }
    formEl.reset();
    //package up data as an object
    var taskDataObj ={
        name: taskNameInput,
        type: taskTypeInput
    };

    var isEdit = formEl.hasAttribute("data-task-id");
    
    //has data attribute, so get task id and call function to complete edit process
    if(isEdit){
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask (taskNameInput, taskTypeInput, taskId);
    }
    //no data attribute, so create object as normal and pass to createTaskEl function
    else{
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
        };
        createTaskEl(taskDataObj);
    }
}
var completeEditTask = function(taskName, taskType, taskId){
    //find matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='"+ taskId + "']");
    
    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    alert("Task Updated");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";

};
var createTaskEl = function(taskDataObj) {
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);

  // create task actions (buttons and select) for task
  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);
  tasksToDoEl.appendChild(listItemEl);

  // increase task counter for next unique id
  taskIdCounter++;
};

var createTaskActions = function(taskId){   

    //create a div with class name task-actions
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create button elements and append them to the div above

    //create edit button and assign it to task id
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className="btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent ="Delete";
    deleteButtonEl.className= "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    //create select dropdown
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className="select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    //create array with options for select dropdown in for loop
    var statusChoices = ["To Do", "In Progress", "Completed"];

    //write for loop
    for (i=0; i<statusChoices.length; i++){
        //create option element 
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent= statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        //append to select
        statusSelectEl.appendChild(statusOptionEl)
    }

    return actionContainerEl;
}

formEl.addEventListener("submit", taskFormHandler);

//create 
var taskButtonHandler = function(event){

    //get target element from event
    var targetEl = event.target;

    //edit button was clicked
    if(targetEl.matches(".edit-btn")){
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    //delete button was clicked
    else if (targetEl.matches(".delete-btn")){
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

//create edit function
var editTask = function(taskId) {
    console.log(taskId);
  
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  
    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    console.log(taskName);
  
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    console.log(taskType);
  
    // write values of taskname and taskType to form to be edited
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
  
    // set data attribute to the form with a value of the task's id so it knows which one is being edited
    formEl.setAttribute("data-task-id", taskId);
    // update form's button to reflect editing a task rather than creating a new one
};
  
//create delete function
var deleteTask = function(taskId) {
    console.log(taskId);
    // find task list element with taskId value and remove it
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
}

var taskStatusChangeHandler = function(event){

    //get the task items id
    var taskId = event.target.getAttribute("data-task-id");

    //get the currently selected options value and convert to lowercase
    var statusValue= event.target.value.toLowerCase();

    //find the parent task item based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='"+taskId +"']");

    if (statusValue === "to do"){
        tasksToDoEl.appendChild(taskSelected);
    } else if(statusValue === "in progress"){
        tasksInProgressEl.appendChild(tasksSelected);
    } else if(statusValue === "completed"){
        taskCompletedEl.appendChild(taskSelected);
    }
};

//listen for clicks on the main section
pageContentEl.addEventListener("click", taskButtonHandler)

pageContentEl.addEventListener("change", taskStatusChangeHandler);