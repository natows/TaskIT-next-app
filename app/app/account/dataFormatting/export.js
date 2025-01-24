"use client";

import { currentUser } from "../../login/user.js"; 

export default function exportTasks(format) {
    const user = currentUser(); 
    if (!user) {
        alert("You need to be logged in to export tasks.");
        return;
    }

    const userId = user.userId; 
    const storedData = localStorage.getItem(userId);
    if (!storedData) {
        alert("No tasks found to export.");
        return;
    }

    const parsedData = JSON.parse(storedData);
    const tasksByDate = parsedData.tasksByDate || {}; 

    let exportedData = "";
    let fileType = "";
    let fileName = `tasks_export.${format}`;

    if (format === "json") {
        exportedData = JSON.stringify(tasksByDate, null, 2);
        fileType = "application/json";
    } else if (format === "csv") {
        const csvRows = [];
        csvRows.push("Date,Task Name,Description,Priority,Done"); 

        for (const [date, taskData] of Object.entries(tasksByDate)) {
            taskData.tasks.forEach((task) => {
                csvRows.push(
                    `${date},"${task.name}","${task.description}","${task.priority}",${task.done}`
                );
            });
        }

        exportedData = csvRows.join("\n");
        fileType = "text/csv";
    } else if (format === "xml") {
        const xmlRows = [];
        xmlRows.push("<tasks>");

        for (const [date, taskData] of Object.entries(tasksByDate)) {
            xmlRows.push(`  <date value="${date}">`);
            taskData.tasks.forEach((task) => {
                xmlRows.push("    <task>");
                xmlRows.push(`      <name>${task.name}</name>`);
                xmlRows.push(`      <description>${task.description}</description>`);
                xmlRows.push(`      <priority>${task.priority}</priority>`);
                xmlRows.push(`      <done>${task.done}</done>`);
                xmlRows.push("    </task>");
            });
            xmlRows.push("  </date>");
        }

        xmlRows.push("</tasks>");
        exportedData = xmlRows.join("\n");
        fileType = "application/xml";
    } else {
        alert("Unsupported format. Please choose 'json', 'csv', or 'xml'.");
        return;
    }

    const blob = new Blob([exportedData], { type: fileType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
}
