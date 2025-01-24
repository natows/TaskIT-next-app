"use client"
export default function importTasks(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        const fileType = file.name.split(".").pop().toLowerCase();

        let importedData = {};

        if (fileType === "json") {
            importedData = JSON.parse(content);
        } else if (fileType === "csv") {
            const rows = content.split("\n");
            rows.shift(); 
            importedData = {};

            rows.forEach((row) => {
                const [date, name, description, priority, done] = row.split(",");
                if (!importedData[date]) importedData[date] = { tasks: [] };
                importedData[date].tasks.push({
                    name: name.replace(/"/g, ""),
                    description: description.replace(/"/g, ""),
                    priority,
                    done: done === "true",
                });
            });
        } else if (fileType === "xml") {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(content, "application/xml");

            importedData = {};
            const dates = xmlDoc.getElementsByTagName("date");

            Array.from(dates).forEach((dateElement) => {
                const date = dateElement.getAttribute("value");
                const tasks = Array.from(dateElement.getElementsByTagName("task"));

                importedData[date] = { tasks: tasks.map((task) => ({
                    name: task.getElementsByTagName("name")[0].textContent,
                    description: task.getElementsByTagName("description")[0].textContent,
                    priority: task.getElementsByTagName("priority")[0].textContent,
                    done: task.getElementsByTagName("done")[0].textContent === "true",
                })) };
            });
        }

        const storedTasks = localStorage.getItem("tasksByDate");
        const parsedTasks = storedTasks ? JSON.parse(storedTasks) : {};

        Object.entries(importedData).forEach(([date, data]) => {
            if (!parsedTasks[date]) {
                parsedTasks[date] = { tasks: [] };
            }
            parsedTasks[date].tasks = [...parsedTasks[date].tasks, ...data.tasks];
        });

        localStorage.setItem("tasksByDate", JSON.stringify(parsedTasks));
        alert("Tasks successfully imported!");
    };

    reader.readAsText(file);
}
