let addTaskBtn = document.getElementById("addTaskBtn")
let todoListCont = document.getElementById("todoListCont")
let taskPriority = document.getElementById("taskPriority")
let taskCategory = document.getElementById("taskCategory")
let allTasksBtn = document.getElementById("allTasks")
let activeTasksBtn = document.getElementById("activeTasks")
let completedTasksBtn = document.getElementById("completedTasks")
let saveTaskBtn = document.getElementById("saveTaskBtn")


function getTodosFromLocacalStorage(){
    let todoList = localStorage.getItem("todos")
    if(todoList === null){
        return []
    }
    return JSON.parse(todoList)
}

let todosArr = getTodosFromLocacalStorage()
let todosCount = todosArr.length

//delete todo element functionality
function onDeleteTodo(id){
    let todoEl = document.getElementById("todo" + id)
    todoEl.style.display = 'none'
    todosArr = todosArr.filter((item) => item.id !== id)
    localStorage.setItem("todos",JSON.stringify(todosArr))
}

//onchange checkbox el
function onTodoStatusChange(id){
    let labelEl = document.getElementById("label" + id)
    labelEl.classList.toggle('task-completed')
    todosArr = todosArr.map((item) => {
        if(item.id == id){
            return {...item,completed:!item.completed}
        }else{
            return item
        }
    })
    // localStorage.setItem('todos',JSON.stringify(todosArr))
}

//creating elements in todo list item
function createTodoElements(todo){
    let todoEl = document.getElementById("todo" + todo.id)
    let checkboxId = "checkbox" + todo.id

    //creating divEl
    let inputCont = document.createElement("div")
    inputCont.classList.add('input-cont')
    todoEl.appendChild(inputCont)

    //creating checkbox
    let checkbox = document.createElement("input")
    checkbox.type = 'checkbox'
    checkbox.id = checkboxId 
    checkbox.checked = todo.completed
    inputCont.append(checkbox)

    checkbox.addEventListener("change",() => {
        onTodoStatusChange(todo.id)
    })

    //creating labelEl
    let labelEl = document.createElement("label")
    labelEl.textContent = todo.task 
    labelEl.id = "label" + todo.id
    if(todo.completed){
        labelEl.classList.add('task-completed')
    }else{
        labelEl.classList.remove("task-completed")
    }
    labelEl.setAttribute("for", checkboxId)
    inputCont.append(labelEl)

    //creating spanEl1
    let spanEl1 = document.createElement("span")
    spanEl1.textContent = todo.priority
    if(spanEl1.textContent === "High"){
        spanEl1.style.color = "red"
    }else if(spanEl1.textContent == "Medium"){
        spanEl1.style.color = "orange"
    }else{
        spanEl1.style.color = "green"
    }
    inputCont.append(spanEl1)

    //creating spanEl2
    let spanEl2 = document.createElement("span")
    spanEl2.textContent = todo.category
    inputCont.append(spanEl2)

    //creating btn cont
    let btnCont = document.createElement("div")
    todoEl.appendChild(btnCont)


    //creating edit button
    let editButton = document.createElement("button")
    editButton.textContent = "Edit"
    editButton.classList.add("edit-btn")
    btnCont.append(editButton)

    //onclick edit button
    editButton.addEventListener("click",() => {
        todoEl.innerHTML = ""
        createAndAppendInputEl(todo)
    })

    //creating delete button
    let deleteButton = document.createElement("button")
    deleteButton.textContent = "Delete"
    deleteButton.classList.add("operation-btn")
    btnCont.append(deleteButton)

    //onclick delete button
    deleteButton.addEventListener("click",()=> {
        onDeleteTodo(todo.id)
    })
}

//creating todo list item
function createAndAppendTodo(todo){
    //creating todoEl
    let todoEl = document.createElement('li')
    todoEl.classList.add("todo-list-item")
    todoEl.id = "todo" + todo.id
    todoListCont.appendChild(todoEl) 
    createTodoElements(todo)
}

//making the user to edit task
function createAndAppendInputEl(todo){
    let todoEl = document.getElementById("todo" + todo.id)
    //creating input type text
    let textEl = document.createElement("input")
    textEl.type = 'text'
    textEl.value = todo.task
    textEl.classList.add("edit-text-input")
    todoEl.appendChild(textEl)

    //creating selectEl priority dropdown
    let prioritySelectEl = document.createElement("select")
    prioritySelectEl.classList.add("edit-select-drop-down")
    todoEl.appendChild(prioritySelectEl)

    let priority = ['High',"Medium","Low"]
    for(let i=0;i<3;i++){
        let optionEl = document.createElement("option")
        optionEl.value = priority[i]
        optionEl.textContent = priority[i]
        prioritySelectEl.append(optionEl)
    }

    
    prioritySelectEl.value = todo.priority;

    //creating selectEl category dropdown
    let ctgrySelectEl = document.createElement("select")
    ctgrySelectEl.classList.add("edit-select-drop-down")
    todoEl.appendChild(ctgrySelectEl)

    let category = ['Office',"Personal","Others"]
    for(let i=0;i<3;i++){
        let optionEl = document.createElement("option")
        optionEl.value = category[i]
        optionEl.textContent = category[i]
        ctgrySelectEl.append(optionEl)
    }
    ctgrySelectEl.value = todo.category


    //creating save btn
    let saveBtn = document.createElement("button")
    saveBtn.textContent = "Save"
    saveBtn.classList.add('operation-btn')
    todoEl.appendChild(saveBtn)
    
    //onclcik save btn
    saveBtn.onclick = () => {
        if(textEl.value == ""){
            alert("Enter any task")
            return 
        }
        todoEl.innerHTML = ""
        let editedTask = 
            {   
                id:todo.id,
                task:textEl.value,
                completed:todo.completed,
                priority:prioritySelectEl.value,
                category:ctgrySelectEl.value
            }
        todosArr = todosArr.map((item) => {
            if(item.id == todo.id){
                return editedTask
            }else{
                return item
            }
        })
        createTodoElements(editedTask)
    }
}
//onclick add task button
addTaskBtn.addEventListener("click",() => {
    let taskInput = document.getElementById("taskInput").value 
    if(taskInput === ""){
        alert("Please enter any task")
        return 
    }
    todosCount += 1
    let newTodo = {
        id:Date.now(),
        task:taskInput,
        completed:false,
        priority:taskPriority.value,
        category:taskCategory.value
    }
    todosArr.push(newTodo)
    createAndAppendTodo(newTodo)
    document.getElementById("taskInput").value = ""
    
})

//render todos that are stored in local storage
for(let item of todosArr){
    createAndAppendTodo(item)
}

//onclicksave-task-btn
saveTaskBtn.addEventListener("click",() => {
    localStorage.setItem('todos',JSON.stringify(todosArr))
})

//render all todos when user clicks add btn
allTasksBtn.addEventListener("click",() => {
    todoListCont.innerHTML = ""
    for(let item of todosArr){
        createAndAppendTodo(item)
    }
})

//render tasks that has to complete when user clicks active btn
activeTasksBtn.addEventListener("click",() => {
    let tasksToComplete = todosArr.filter((item) => item.completed === false)
    todoListCont.innerHTML = ""
    for(let item of tasksToComplete){
        createAndAppendTodo(item)
    }
})

//render completed tasks when user clicks on complete btn
completedTasksBtn.addEventListener("click",() => {
    let completedTasks = todosArr.filter((item) => item.completed === true)
    todoListCont.innerHTML = ""
    for(let item of completedTasks){
        createAndAppendTodo(item)
    }
})
