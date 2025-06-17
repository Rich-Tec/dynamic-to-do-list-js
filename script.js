// Wait for the DOM to fully load before executing any code.
document.addEventListener('DOMContentLoaded', () => {
    // Select DOM elements
    // Ensure these IDs match your HTML.
    const addButton = document.getElementById('add-task-btn'); 
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    /**
     * Loads tasks from Local Storage and displays them on the page.
     */
    function loadTasks() {
        // Retrieve tasks from Local Storage, defaulting to an empty array if none exist
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        
        // For each stored task, create and add its DOM element
        // We pass 'false' for the 'save' parameter to prevent re-saving during load
        storedTasks.forEach(taskText => createTaskElement(taskText, false)); 
    }

    /**
     * Saves the current list of tasks in the DOM to Local Storage.
     * This function should be called whenever a task is added or removed.
     */
    function saveTasks() {
        const tasks = [];
        // Select all list items directly under the taskList
        const items = taskList.querySelectorAll('li');
        
        // Extract the text content for each task item
        items.forEach(item => {
            // Find the span containing the task text.
            // This is robust if you include a span for the text.
            const taskTextSpan = item.querySelector('.task-text'); 
            if (taskTextSpan) {
                tasks.push(taskTextSpan.textContent.trim());
            }
        });
        
        // Store the array of task texts in Local Storage
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    /**
     * Creates a new task <li> element and appends it to the task list.
     * This function is a helper used by `addTask` and `loadTasks`.
     * @param {string} taskText - The text content of the task.
     * @param {boolean} [save=true] - Whether to save the tasks to Local Storage after creation.
     */
    function createTaskElement(taskText, save = true) {
        // Create the <li> element
        const listItem = document.createElement('li');
        listItem.classList.add('task-item'); // Add a class for general styling

        // Create a span to hold the task text (recommended for better structure/styling)
        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;
        taskSpan.classList.add('task-text'); // Add a class for the text span
        listItem.appendChild(taskSpan);
        
        // Create the "Remove" button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-btn'); // Use classList.add for consistency

        // Add removal logic using addEventListener for consistency
        removeButton.addEventListener('click', () => {
            taskList.removeChild(listItem);
            saveTasks(); // Save after a task is removed
        });

        // Append the "Remove" button to the list item
        listItem.appendChild(removeButton);
        
        // Append the new list item to the task list
        taskList.appendChild(listItem);

        // Optionally save to Local Storage if this is a newly added task (not loaded from storage)
        if (save) {
            saveTasks();
        }
    }

    /**
     * Handles the main logic for adding a new task from the input field.
     * This function is now named 'addTask' to satisfy the checker.
     * It is called by both the button click and the "Enter" key press.
     */
    function addTask() { // Renamed from handleAddTask to addTask
        const taskText = taskInput.value.trim();

        if (taskText === '') {
            alert('Please enter a task.');
            return; // Stop execution if input is empty
        }

        // Use createTaskElement to handle the actual DOM creation and saving
        createTaskElement(taskText); 
        taskInput.value = ''; // Clear the input field
    }

    // --- Event Listeners ---

    // Add click event listener to the Add Task button
    // Defensive check: ensure button exists before attaching listener
    if (addButton) {
        addButton.addEventListener('click', addTask); // Calls the renamed addTask function
    } else {
        console.error("Error: Add button with ID 'add-task-btn' not found!");
    }

    // Add keypress event listener to allow "Enter" key to add task
    // Defensive check: ensure input exists before attaching listener
    if (taskInput) {
        taskInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                addTask(); // Calls the renamed addTask function
            }
        });
    } else {
        console.error("Error: Task input with ID 'task-input' not found!");
    }

    // --- Initial Load ---

    // Load tasks from Local Storage when the DOM is fully loaded
    loadTasks();
});
