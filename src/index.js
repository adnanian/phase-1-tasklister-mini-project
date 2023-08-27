document.addEventListener("DOMContentLoaded", () => {

  document.querySelector('#list').style.width = 'fit-content';
  
  // Create Priority Drop-Down List & Append to DOM
  // Create Label
  const dropDownLabel = document.createElement('label');
  dropDownLabel.setAttribute('for', 'initial-priority');
  dropDownLabel.textContent = 'Priority: ';
  // Create Drop-Down
  const initialPriorityDropDown = createPriorityDropDown();
  initialPriorityDropDown.setAttribute('id', 'initial-priority');
  // Insert label and drop-down
  const form = document.querySelector('form');
  const formArray = Array.from(form.children);
  form.insertBefore(dropDownLabel, formArray[formArray.length - 1]);
  form.insertBefore(initialPriorityDropDown, formArray[formArray.length - 1]);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    //console.log(e.target.querySelector('#new-task-description').value);
    let todo = e.target.querySelector('#new-task-description');
    buildToDo(todo.value);
    todo.value = "";
  });
});

class Option {
  constructor(value, text) {
    this.value = value;
    this.text = text;
  }
}

function createPriorityDropDown() {
  let dropDown = document.createElement('select');
  let options = [new Option('high', 'High'), new Option('med', 'Medium'), new Option('low', 'Low')];
  for (let i = 0; i < options.length; i++) {
    let newOption = document.createElement('option');
    newOption.setAttribute('value', options[i].value);
    newOption.textContent = options[i].text;
    dropDown.appendChild(newOption);
  }
  return dropDown;
}

function buildToDo(todo) {
  let task = document.createElement('li');
  // Create buttons
  let deleteButton = createButton('X', 'Click on this button to remove the task from the list.', deleteToDo);
  let editButton = createButton('Rename', 'Click on this button to edit the task description.', editTaskName);
  
  // Add Task Description
  let description = document.createElement('span');
  description.setAttribute('class', 'task');
  description.textContent = `| ${todo} |`;
  

  // Create Priority Drop Down
  let priorityDropDown = createPriorityDropDown();
  priorityDropDown.setAttribute('class', 'priority');
  priorityDropDown.addEventListener('change', (e) => {
    console.log(e.target);
    task.remove();
    description.style.background = setPriorityBackgroundColor(e.target.value);
    sortAndInsert(task);
  });
  

  // Append Task
  task.appendChild(deleteButton);
  task.appendChild(editButton);
  task.appendChild(priorityDropDown);
  task.appendChild(description);
  for (const node of task.childNodes) {
    node.style.fontSize = '20px';
    node.style.fontWeight = 'bold';
  }
  priorityDropDown.value = document.getElementById('initial-priority').value;
  description.style.background = setPriorityBackgroundColor(priorityDropDown.value);
  sortAndInsert(task);
  console.log(todo);

}

function sortAndInsert(task) {
  let taskList = document.querySelector('#tasks');
  if (taskList.children.length === 0) {
    taskList.appendChild(task);
  } else {
    let taskArray = Array.from(taskList.children);
    let selectedValue = task.querySelector('.priority').value;
    let i = taskArray.indexOf(taskArray.find((item) => {
      return item.querySelector('.priority').value === selectedValue;
    }));
    let prioritiesMatch;
    console.log(i);
    while (i >= 0 && i < taskArray.length) {
      prioritiesMatch = (taskArray[i].querySelector('.priority').value === selectedValue);
      if (task.querySelector('.task').textContent <= taskArray[i].querySelector('.task').textContent || !prioritiesMatch) {
        taskList.insertBefore(task, taskArray[i]);
        return;
      }
      i++;
    }
    taskList.appendChild(task);
  }
}


function createButton(text, toolTipText, eventListener) {
  let button = document.createElement('button');
  button.textContent = text;
  button.setAttribute('title', toolTipText);
  button.addEventListener('click', eventListener);
  return button;
}

function deleteToDo(e) {
  e.target.parentNode.remove();
}

function editTaskName(e) {
  let editedTask = e.target.parentNode;
  console.log(editedTask);
  deleteToDo(e);
  let todo = document.querySelector('#new-task-description');
  editedTask.querySelector('.task').textContent = `| ${todo.value} |`;
  sortAndInsert(editedTask);
  todo.value = "";
}

function setPriorityBackgroundColor(value) {
  switch (value) {
    case "high":
      return '#ec7272';
    case "med":
      return 'yellow';
    case "low":
      return '#0f0';
    default:
      return 'white';
  }
}