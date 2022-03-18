var publicTasks = [];
let checkboxToggle = document.querySelector('.checkbox-toggle');
let body = document.body;
let newTodoCheckMark = document.querySelector(".new-todo .check-circle");
let newCheck = false;
const pages = document.querySelectorAll(".items-status span");

function addItem(event){
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    event.preventDefault();
    let text = document.getElementById("todo-input");
    let newItem = db.collection("todo-items").add({
        time: -timestamp,
        text: text.value,
        done: newCheck ? true : false
    })
    text.value = "";
    newCheck = false;
    newTodoCheckMark.classList.remove("checked");

    showAll(pages);
}

function getItems(){
    db.collection("todo-items").orderBy('time').onSnapshot((snapshot) => {
        let items = [];
        snapshot.docs.forEach((doc) => {
            items.push({
                id: doc.id, 
                ...doc.data()
            })
        })
        publicTasks = items;
        generateItems(items);
    })
}
getItems();

function generateItems(items){
    let itemsHTML = "";
    let taskNum = 0;
    items.forEach((item) => {
        itemsHTML += `
        <div class="todo-item">
            <div class="check">
                <div data-id="${item.id}" class="check-circle ${item.done ? "checked" : ""}">
                    <img src="./assets/icon-check.svg" />
                </div>
            </div>
            <div class="todo-text ${item.done ? "checked" : ""}">
                <span class="crop">${item.text}</span>
            </div>
            <div class="delete-container">
            <div data-id=${item.id} class="delete-item">
                <img src="assets/icon-cross.svg" alt="del-icon"></img>
            </div>
            </div>
        </div>
        `;
        taskNum++;
    });

    let itemRem = document.querySelector(".items-left");
    itemRem.innerHTML = taskNum + ' items';

    document.querySelector(".todo-items").innerHTML = itemsHTML;
    createEventListeners(items);
}

function createEventListeners(items){
    let todoCheckMarks = document.querySelectorAll(".todo-item .check-circle");
    let clear = document.querySelector('.items-clear');

    todoCheckMarks.forEach((check) => {
        check.addEventListener("click", function(){
            markCompleted(check.dataset.id);
        });
        clear.addEventListener('click', function() {
            clearCompleted(check.dataset.id);
        });
    });

    pages.forEach((page) => page.addEventListener("click", () => {
        pages.forEach(activepage => (activepage.textContent === page.textContent) ? activepage.classList.add("active") : activepage.classList.remove("active"))
        statusPages(publicTasks);
    }));

    let delItem = document.querySelectorAll(".todo-item .delete-item");
    delItem.forEach((del) => {
        del.addEventListener('click', function(){
            deleteItem(del.dataset.id);
        });
    });
}

checkboxToggle.addEventListener("change", function(){
    if(checkboxToggle.checked){
        body.classList.add("light")
        body.classList.remove("dark")
    }else{
        body.classList.add("dark")
    }
})

function showAll(pages){
    pages.forEach(page => {
        page.classList.remove("active")
        if (page.textContent === "All") page.classList.add("active");
    });
}

function createNewTodoListener() {
    newTodoCheckMark.addEventListener("click", function(){
        newCheck = !newCheck; 
        newCheck ? newTodoCheckMark.classList.add("checked") : newTodoCheckMark.classList.remove("checked");        
    });
}
createNewTodoListener();

function statusPages(items) {
    const page = document.querySelector(".active").textContent
    const resetList = document.querySelector('.todo-items')
    resetList.innerHTML = " ";
    let listTaskTemporal = [...items];
    if (page != "All") {
      const done = (page === "Completed");
      listTaskTemporal = items.filter((task) => task.done === done)
    } 
    generateItems(listTaskTemporal);
}

function deleteItem(id){
    let del = db.collection("todo-items").doc(id);
    del.delete()
}

function markCompleted(id) {
    let item = db.collection("todo-items").doc(id);
    item.get().then(function(doc){
        if(doc.exists){
            let status = doc.data().done;
            if(!status){
                item.update({
                    done: true
                });
            } else {
                item.update({
                    done: false
                });
            }
        }
    });
}

function clearCompleted(id){
    let tb = db.collection('todo-items').doc(id);
    tb.get().then(function (doc) {
        if(doc.exists){
            let status = doc.data().done;
            if(status){
                tb.delete();
            }
        }
    }); 
    showAll(pages);   
}

// function for adding drag and drop feature
/*
const dragArea = document.querySelector('.todo-items');
new Sortable(dragArea, {
    animation: 350,
    chosenClass: 'sort-chosen'
});
*/