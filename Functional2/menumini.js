let taskCounter = 1;

// Обработчик для иконок меню (три точки)
document.querySelectorAll('.menu-icon').forEach(icon => {
    icon.addEventListener('click', function(e) {
        const menu = this.nextElementSibling;
        document.querySelectorAll('.menumini').forEach(m => {
            if (m !== menu) m.style.display = 'none';
        });
        menu.style.display = (menu.style.display === 'block' ? 'none' : 'block');
        e.stopPropagation();
    });
});

// Закрытие меню при клике вне его
document.addEventListener('click', function(e) {
    if (!e.target.closest('.menumini') && !e.target.closest('.menu-icon')) {
        document.querySelectorAll('.menumini').forEach(menu => {
            menu.style.display = 'none';
        });
    }
});

// Запрещаем drop на поля ввода, чтобы задача туда не попадала
document.querySelectorAll('.add-task-btn').forEach(input => {
    input.addEventListener('dragover', e => {
        e.preventDefault();
    });
    input.addEventListener('drop', e => {
        e.preventDefault();
        e.stopPropagation();
    });
});

// Функция создания задачи
function createTask(inputElement, taskListElement) {
    const taskText = inputElement.value.trim();
    if (!taskText) return;
    
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-item';
    taskDiv.id = 'task-' + taskCounter++;
    taskDiv.setAttribute('draggable', 'true');
    
    // Текст задачи
    const span = document.createElement('span');
    span.textContent = taskText;
    taskDiv.appendChild(span);
    
    // Кнопка удаления задачи
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '×';
    delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        taskDiv.remove();
    });
    taskDiv.appendChild(delBtn);
    
    // События для drag & drop
    taskDiv.addEventListener('dragstart', dragStart);
    taskDiv.addEventListener('dragend', dragEnd);
    
    taskListElement.appendChild(taskDiv);
    inputElement.value = '';
}

// Функции для drag & drop
function dragStart(ev) {
    ev.dataTransfer.setData('text/plain', ev.target.id);
    ev.target.classList.add('dragging');
}

function dragEnd(ev) {
    ev.target.classList.remove('dragging');
}

// Обработка drop на уровне столбца, чтобы даже пустой список принимал задачу
document.querySelectorAll('.task-column1, .task-column2, .task-column3').forEach(column => {
    column.addEventListener('dragover', function(ev) {
        ev.preventDefault();
    });
    
    column.addEventListener('drop', function(ev) {
        if (ev.target.tagName.toLowerCase() === 'input') {
            ev.preventDefault();
            return;
        }
        ev.preventDefault();
        const taskId = ev.dataTransfer.getData('text/plain');
        const taskElement = document.getElementById(taskId);
        const taskList = column.querySelector('.task-list');
        if (taskElement && taskList) {
            taskList.appendChild(taskElement);
        }
    });
});

// Обработчики для кнопок Create и Delete в каждом выпадающем меню
document.querySelectorAll('.menumini').forEach(menu => {
    const container = menu.closest('.input-container');
    const input = container.querySelector('input');
    const column = container.closest('[id]');
    const taskList = column.querySelector('.task-list');
    
    menu.querySelector('.create-action').addEventListener('click', function(e) {
        e.preventDefault();
        createTask(input, taskList);
        menu.style.display = 'none';
    });
    
    menu.querySelector('.delete-action').addEventListener('click', function(e) {
        e.preventDefault();
        taskList.innerHTML = '';
        menu.style.display = 'none';
    });
});
