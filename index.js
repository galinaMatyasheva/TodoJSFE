let allTasks = [];
let valueInput = "";
let input = null;
let text = "";
let textEdit = "";
const textReady = "";

window.onload = async function init() {
  input = document.getElementById("add-task");
  input.addEventListener("change", updateValue);
  const deleteAll = document.getElementById("delete-all");
  deleteAll.style.display = allTasks.length === 0 ? "none" : "block";

  const response = await fetch("http://localhost:8000/tasks", {
    method: "GET",
  });
  let result = await response.json();
  allTasks = result.data;
  render();
};

onClickButton = async () => {
  allTasks.push({
    text: valueInput,
    isCheck: false,
  });

  textEdit = valueInput;

  const response = await fetch("http://localhost:8000/tasks", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      "Access-Control-Allow-Origin": '*'
    },
    body: JSON.stringify({
      text: input.value ? valueInput : alert("First enter the text of the task"),
      isCheck: false,
    })
  });

  let result = await response.json();
  allTasks = result.data;
  localStorage.setItem('tasks', JSON.stringify(allTasks));
  valueInput = "";
  input.value = "";
  render();
};

updateValue = (event) => {
  valueInput = event.target.value;
};

render = () => {
  const content = document.getElementById("content-page");
  const deleteAll = document.getElementById("delete-all");
  deleteAll.style.display = allTasks.length === 0 ? "none" : "block";
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  allTasks.sort((a, b) => a.isCheck - b.isCheck);

  allTasks.map((item, index) => {
    const container = document.createElement("div");
    container.className = "container";

    container.id = `task-${index}`;

    const taskTextWrap = document.createElement("div");
    taskTextWrap.className = "task-text-wrap";
    container.appendChild(taskTextWrap);

    const checkbox = document.createElement("input");
    checkbox.id = "checkbox";
    checkbox.type = "checkbox";
    checkbox.checked = item.isCheck;

    checkbox.onchange = function () {
      onChangeCheckbox(index);
    };

    checkbox.style.display = item.isEdit ? "none" : "block";
    taskTextWrap.appendChild(checkbox);
    if (!item.isCheck) {
      container.ondblclick = function () {
        onClickEditTask(index);
      }
    }
    text = item.isEdit
      ? document.createElement("input")
      : document.createElement("p");
    text.type = "text";

    text.addEventListener("change", (e) => {
      updateTask(e);
    });

    item.isEdit ? (text.value = item.text) : (text.innerText = item.text);

    text.className = item.isCheck ? "text-task done-text" : "text-task";

    taskTextWrap.appendChild(text);

    const iconWrap = document.createElement("div");
    iconWrap.className = "icon-wrap";
    container.appendChild(iconWrap);

    const imageEdit = document.createElement("i");
    imageEdit.className = "fas fa-edit";

    iconWrap.appendChild(imageEdit);
    imageEdit.checked = item.isEdit;
    imageEdit.onclick = function () {
      onClickEditTask(index);
    };

    imageEdit.style.display = item.isCheck || item.isEdit ? "none" : "block";

    const imageDone = document.createElement("i");
    imageDone.className = "fas fa-check";
    iconWrap.appendChild(imageDone);
    imageDone.checked = item.isEdit;
    imageDone.onclick = function () {
      onClickDoneTask(index);
    };

    imageDone.style.display = item.isEdit ? "block" : "none";

    const imageDelete = document.createElement("i");
    imageDelete.className = "fas fa-trash-alt";
    imageDelete.id = "delete";
    iconWrap.appendChild(imageDelete);

    imageDelete.onclick = function () {
      onClickDeleteTask(index);
    };

    imageDelete.style.display = item.isEdit ? "none" : "block";
    imageDelete.style.marginLeft = item.isCheck ? "30px" : "0px";

    const imageCancel = document.createElement("i");
    imageCancel.className = "fas fa-times";
    iconWrap.appendChild(imageCancel);
    imageCancel.id = "cancel";

    imageCancel.onclick = function () {
      onClickCancelTask(index);
    };

    imageCancel.style.display = item.isEdit ? "block" : "none";
    content.appendChild(container);
  });
};

onChangeCheckbox = async (index) => {
  allTasks[index].isCheck = !allTasks[index].isCheck;
  const response = await fetch("http://localhost:8000/tasks", {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      "Access-Control-Allow-Origin": '*'
    },
    body: JSON.stringify({
      _id: allTasks[index]._id,
      isCheck: allTasks[index].isCheck
    })
  });
  let res = await response.json();
  allTasks = res.data;
  render();
};

onClickDeleteTask = async (index) => {
  const response = await fetch(`http://localhost:8000/tasks/${allTasks[index]._id}`, {
    method: "DELETE",
  })
  let result = await response.json();
  allTasks = result.data;
  render();
};

onClickDeleteAll = async () => {
  allTasks.forEach(async (item) => {
    const response = await fetch(`http://localhost:8000/tasks`, {
      method: "DELETE",
    })
  });
  allTasks = [];
  render();
}

updateTask = (event) => {
  textEdit = event.target.value;
};

onClickEditTask = (index) => {
  allTasks.forEach((item, index) => {
    if (item.isEdit) {
      allTasks[index].isEdit = false;
    }
  });
  textEdit = allTasks[index].text;
  allTasks[index].isEdit = !allTasks[index].isEdit;
  render();
};

onClickDoneTask = async (index) => {
  if (allTasks[index].isEdit) {
    allTasks[index].text = textEdit;
  }
  allTasks[index].isEdit = !allTasks[index].isEdit;

  const response = await fetch("http://localhost:8000/tasks", {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      "Access-Control-Allow-Origin": '*'
    },
    body: JSON.stringify({
      _id: allTasks[index]._id,
      text: textEdit,
      isCheck: allTasks[index].isCheck
    })
  });

   let res = await response.json();
  render();
};

onClickCancelTask = (index) => {
  allTasks[index].isEdit = !allTasks[index].isEdit;
  render();
};

