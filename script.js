function test(text){
    outputTest=document.querySelector("#sidebar .header");
    outputTest.textContent=(text);
}
//handles all catagory CRUD
catHandler=(function () {
    //category factory. room for extension
    const category=(title)=>{
        return {title};
    }
    let catList=[];
    const create=(input)=>catList.push(category(input));
    const update=(newValue,idx,which='title')=>{
        switch(which){
            case 'title': catList[idx].title=newValue;break;
        }
    };
    const del=(idx)=>{
        catList.splice(idx,1);
    }
    create("Main");
    create("Secondary");
    return {create, catList, update, del}
})();


// Handles all task CRUD
taskHandler=(function () {
    //task factory. room for extension
    const task=(title, project, done, priority, dueDate, description, notes, masterIdx)=>{
        return {title, project, done, priority, dueDate, description, notes, masterIdx};
    }
    let taskList=[];
    const create=(title, project=null, done=false, priority='low', dueDate=null, description=null,notes=null)=>{
        taskList.push(task(title, project, done, priority, dueDate, description,notes));
        updateIndex();
    }
    
    const update=(idx, which, newValue)=>{
        switch(which){
            case 'title': taskList[idx].title=newValue;break;
            case 'description': taskList[idx].description=newValue;break;
            case 'dueDate': taskList[idx].dueDate=newValue;break;
            case 'priority': taskList[idx].priority=newValue;break;
            case 'notes': taskList[idx].notes=newValue;break;
            case 'project': taskList[idx].project=newValue;break;
            case 'done' : taskList[idx].done=newValue;break;
        }
        updateIndex();
    }
    const del=(idx)=>{
        taskList.splice(idx,1);
        updateIndex();
    }
    const updateIndex=()=>{
        taskList.forEach((element,index)=>{
            element.masterIdx=index;
        })
    }

    create("I'm in main", 0);
    create("I'm in main 2", 0);
    create("I'm in secondary", 1);
    create("I'm in secondary and im done", 1, true);
    updateIndex();
    return {create, taskList,update, del}
})();



drawHandler=(function () {
    function _removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
    let selectedCat=0;
    let catFilter;
    let selectedTask;

    function catHighlight(input){
        delThis=document.querySelectorAll(".catItemSelected");
        delThis.forEach(element=>element.classList.remove("catItemSelected"));

        selectedCatBox=document.querySelector(`.catItemBox[data-idx="${input}"]`);
        selectedCatBox.classList.add("catItemSelected");

    }

    function taskHighlight(input){
        //console.log("task highlight highliting: "+input);
        delThis=document.querySelectorAll(".taskSelected");
        delThis.forEach(element=>element.classList.remove("taskSelected "));

        selectedTask=document.querySelectorAll(`.taskItemBox[data-idx="${input}"]`);
        //selectedTask.classList.add("taskSelected");
        selectedTask.forEach(element=>element.classList.add("taskSelected"));
    }

    const updateCat=()=>{        
        catContainer=document.querySelector('#catContainer');
        catContainerChild=catContainer.querySelectorAll('.catItemBox,#catAddBtn');
        catContainerChild.forEach(element=>element.remove());
        catHandler.catList.forEach((element,index) => {
            //FOR EACH CATITEMBOX HERE
            //Initiation
            catItemBox=document.createElement('div');
            catItemBox.classList.add('catItemBox');
            catItemText=document.createElement('span');
            catItemBox.dataset.idx=index;
            catItemText.dataset.idx=index;
            catItemText.classList.add('catItemText');            
            catItemText.textContent=element.title;
            catContainer.appendChild(catItemBox);
            catItemBox.appendChild(catItemText);

            //Internal button functions

            function catItemBoxHoverFunc(){
                catEdit=document.createElement('i');
                catEdit.classList.add('catEdit');
                catEdit.classList.add('fas');
                catEdit.classList.add('fa-pencil-alt');
                catEdit.dataset.idx=this.dataset.idx;
                catEdit.addEventListener('click',catEditPress);
                function catEditPress(){
                    input=prompt("Change Category Name : " );
                    if (input!=null) catHandler.update(input,this.dataset.idx, 'title');
                    updateAll();
                }
                this.appendChild(catEdit);

                catItemDel=document.createElement('i');
                catItemDel.classList.add('catItemDel');
                catItemDel.classList.add('fas');
                catItemDel.classList.add('fa-trash-alt');
                catItemDel.dataset.idx=this.dataset.idx;
                catItemDel.addEventListener('click',catItemDelPress);
                function catItemDelPress(){
                    if(confirm("are you sure about deleting?")) {
                        allTaskFromCat=taskHandler.taskList.filter((el)=>el.project==this.dataset.idx);
                        // allTaskFromCat=allTaskFromCat.filter((el)=>{
                        //     el.masterIdx>0;
                        // });
                        allTaskFromCat.forEach((el)=>{
                            taskHandler.del(el.masterIdx);
                        });
                        catHandler.del(this.dataset.idx);
                        console.log(allTaskFromCat);
                        //catHandler.del(this.dataset.idx);
                        
                    }
                    updateAll();
                }
                this.appendChild(catItemDel);

            }
            function catItemBoxHoverFunc2(){
                this.removeChild(catItemDel);
                this.removeChild(catEdit);
                
            }
            function catTextPress(){
                selectedCat=this.dataset.idx;
                catFilter=this.textContent;
                updateAll();
            }
            
            //Button hovers and clicks
            catItemBox.addEventListener("mouseenter", catItemBoxHoverFunc);
            catItemBox.addEventListener("mouseleave", catItemBoxHoverFunc2);
            catItemText.addEventListener("click",catTextPress);
        });
        catAddBtn=document.createElement('i');
        catAddBtn.classList.add('catItemDel');
        catAddBtn.classList.add('fas');
        catAddBtn.classList.add('fa-plus');
        catAddBtn.id=("catAddBtn");
        catContainer.appendChild(catAddBtn);    
        catAddBtn.addEventListener('click',()=>{
            catHandler.create(prompt("Add a new Project"))
            updateAll();
        });    
    }
  
    const updateTask=(input)=>{
        taskContainer=document.querySelector('#taskContainer');
        _removeAllChildNodes(taskContainer);
        taskContainer.innerHTML='';
        taskImport=taskHandler.taskList;
        if(input!=null) taskImport=taskImport.filter((element)=>element.project==selectedCat);
        taskImport.forEach((element)=>{
            //Task Item Box
            taskItemBox=document.createElement('div');
            taskItemBox.dataset.idx=element.masterIdx;
            taskItemBox.classList.add("taskItemBox");

            //Task Text
            taskText=document.createElement('p');
            taskText.textContent=element.title;
            taskText.classList.add('taskText');
            taskText.dataset.idx=element.masterIdx;

            //TICK FUNCTIONS
            taskTick=document.createElement('input');
            taskTick.type="checkbox";
            taskTick.dataset.idx=element.masterIdx;
            taskTick.checked=element.done;
            taskTick.classList.add("taskTick")
            function tickFunc(){
                taskHandler.update(this.dataset.idx,'done', this.checked);
            }
            taskTick.addEventListener('click', tickFunc);

            //Hovering Delete button
            taskItemBox.addEventListener("mouseenter",taskHoverFunc);
            taskItemBox.addEventListener("mouseleave",taskHoverFunc2);
            taskItemBox.addEventListener("click", taskPress);
            function taskHoverFunc(){

                //Edit Button
                taskEdit=document.createElement('i');
                taskEdit.classList.add('taskEdit');
                taskEdit.classList.add('fas');
                taskEdit.classList.add('fa-pencil-alt');
                taskEdit.dataset.idx=this.dataset.idx;
                this.appendChild(taskEdit);

                //Delete Button
                taskDel=document.createElement('i');
                taskDel.classList.add('taskDel');
                taskDel.classList.add('fas');
                taskDel.classList.add('fa-trash-alt');
                taskDel.dataset.idx=this.dataset.idx;
                this.appendChild(taskDel);
            }
            function taskHoverFunc2(){
                this.removeChild(taskDel);
                this.removeChild(taskEdit);
            }
            function taskPress(){
                selectedTask=this.dataset.idx;
                updateAll();

            }



            //Append all objects to taskContainer
            taskItemBox.appendChild(taskTick);
            taskItemBox.appendChild(taskText);
            taskContainer.appendChild(taskItemBox);
        });
        taskAdd=document.createElement('i');
        taskAdd.classList.add('fas');
        taskAdd.classList.add('fa-plus');
        taskAdd.id=("catAddBtn");
        taskContainer.appendChild(taskAdd);
        taskAdd.addEventListener("click",()=>{
            input=prompt("Add a new Task : ");
            if(input!=null) taskHandler.create(input,selectedCat);
            updateAll();
        });
    }

    const updateDetail=()=>{

    }
    const updateAll=()=>{
        updateCat();
        updateTask(selectedCat);
        catHighlight(selectedCat);
        taskHighlight(selectedTask);
    }
    updateAll();
    
    return {updateCat,updateTask}
})();


