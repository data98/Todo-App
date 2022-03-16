let checkboxToggle = document.querySelector('.checkbox-toggle');
let body = document.body;

checkboxToggle.addEventListener("change", function(){
    if(checkboxToggle.checked){
        body.classList.add("light")
        body.classList.remove("dark")
    }else{
        body.classList.add("dark")
    }
})

function addItem(event){
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    event.preventDefault();
    let text = document.getElementById("todo-input");
    let newItem = db.collection("todo-items").add({
        time: -timestamp,
        text: text.value,
        done: false
    })
    text.value = "";
}

var publicTasks = [];

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
            <div data-id=${item.id} class="delete-item">
                <img src="assets/icon-cross.svg" alt="del-icon"></img>
            </div>
        </div>
        `;
        taskNum++;
    });

    let itemRem = document.querySelector(".items-left");
    itemRem.innerHTML = taskNum + ' items left';

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
            clearCompleted(check.dataset.id)
        });
    });

    const pages = document.querySelectorAll(".items-status span");
    pages.forEach((page) => page.addEventListener("click", () => {
        pages.forEach(activepage => (activepage.textContent === page.textContent) ? activepage.classList.add("active") : activepage.classList.remove("active"))
        statusPages(items);
    }));

    let delItem = document.querySelectorAll(".todo-item .delete-item");
    delItem.forEach((del) => {
        del.addEventListener('click', function(){
            deleteItem(del.dataset.id);
        });
    });
}

function statusPages(items) {
    const page = document.querySelector(".active").textContent
    const resetList = document.querySelector('.todo-items')
    resetList.innerHTML = " ";
    let listTaskTemporal = [...publicTasks];
    if (page != "All") {
      const done = (page === "Completed");
      listTaskTemporal = publicTasks.filter((task) => task.done === done)
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
            } else if(status){
                item.update({
                    done: false
                });
            }
        }
    });
}

function clearCompleted(id){
    let tb = db.collection('todo-items').doc(id)
    tb.get().then(function (doc) {
        if(doc.exists){
            let status = doc.data().done;
            if(status){
                tb.delete();
            }
        }
    });    
}

getItems();

// const dragArea = document.querySelector('.todo-items');
// new Sortable(dragArea, {
//     animation: 350,
//     chosenClass: 'sort-chosen'
// });