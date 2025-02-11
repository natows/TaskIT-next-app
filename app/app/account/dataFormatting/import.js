"use client";
import { useContext } from "react";
import { UserContext } from "../../login/UserContext";

export default function ImportTasks(event) {
    const { user } = useContext(UserContext);

    if (!user) {
        alert("You need to be logged in to import tasks.");
        return;
    }

    const userId = user.userId;
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
                if (!row.trim()) return; 
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
        } else {
            alert("Unsupported file format. Please upload a JSON, CSV, or XML file.");
            return;
        }

        const storedData = localStorage.getItem(userId);
        const parsedData = storedData ? JSON.parse(storedData) : { tasksByDate: {} };
        const tasksByDate = parsedData.tasksByDate;

        Object.entries(importedData).forEach(([date, data]) => {
            if (!tasksByDate[date]) {
                tasksByDate[date] = { tasks: [] };
            }
            tasksByDate[date].tasks = [...tasksByDate[date].tasks, ...data.tasks];
        });

        localStorage.setItem(userId, JSON.stringify({ ...parsedData, tasksByDate }));
        alert("Tasks successfully imported!");
    };

    reader.readAsText(file);
}
