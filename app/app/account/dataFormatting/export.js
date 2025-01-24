"use client"
export default function exportTasks(format) {
    const storedTasks = localStorage.getItem("tasksByDate");
    if (!storedTasks) {
        alert("No tasks found to export.");
        return;
    }
    
    const tasks = JSON.parse(storedTasks);

    let exportedData = "";
    let fileType = "";
    let fileName = `tasks_export.${format}`;

    if (format === "json") {
        exportedData = JSON.stringify(tasks, null, 2); 
        fileType = "application/json";
    } else if (format === "csv") {
        const csvRows = [];
        csvRows.push("Date,Task Name,Description,Priority,Done"); 

        for (const [date, taskData] of Object.entries(tasks)) {
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

        for (const [date, taskData] of Object.entries(tasks)) {
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
    }

    const blob = new Blob([exportedData], { type: fileType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
}
