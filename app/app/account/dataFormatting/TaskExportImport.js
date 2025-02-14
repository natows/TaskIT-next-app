"use client";
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../login/UserContext";

export default function TaskExportImport() {
    const { user } = useContext(UserContext);
    const [message, setMessage] = useState("");
    

    if (!user){
        return <p>Please log in to export your tasks</p>
    }
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const importTasks = (event) => {
        if (!user) {
            setMessage("You need to be logged in to import tasks.");
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
                setMessage("Unsupported file format. Please upload a JSON, CSV, or XML file.");
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
            setMessage("Tasks successfully imported!");
        };

        reader.readAsText(file);
    };

    const exportTasks = (format) => {
        if (!user) {
            setMessage("You need to be logged in to export tasks.");
            return;
        }

        const userId = user.userId;
        const storedData = localStorage.getItem(userId);
        if (!storedData) {
            setMessage("No tasks found to export.");
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
            setMessage("Unsupported format. Please choose 'json', 'csv', or 'xml'.");
            return;
        }

        const blob = new Blob([exportedData], { type: fileType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        setMessage("Tasks successfully exported!");
    };

    return (
        <div className="p-6 min-h-[50vh] bg-gradient-to-r from-blue-100 to-blue-200 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900">
            <h2 className="textt text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">Export Your Tasks</h2>
            <div className="flex justify-center space-x-4 mb-6">
                <button onClick={() => exportTasks("json")} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">Export as JSON</button>
                <button onClick={() => exportTasks("csv")} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">Export as CSV</button>
                <button onClick={() => exportTasks("xml")} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">Export as XML</button>
            </div>

            <div className="flex flex-col items-center">
                <h3 className="textt text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Import Your Tasks</h3>
                <input
                    type="file"
                    accept=".json,.csv,.xml"
                    onChange={importTasks}
                    className="mb-4"
                />
            </div>

            {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
        </div>
    );
}
