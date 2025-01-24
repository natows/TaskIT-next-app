"use client"
import React from "react";
import importTasks from "./import.js"
import exportTasks from "./export.js"
export default function TaskExportImport() {
    return (
        <div>
            <h2>Export/Import Tasks</h2>
            
            <div>
                <button onClick={() => exportTasks("json")}>Export as JSON</button>
                <button onClick={() => exportTasks("csv")}>Export as CSV</button>
                <button onClick={() => exportTasks("xml")}>Export as XML</button>
            </div>

            <div>
                <h3>Import Tasks</h3>
                <input
                    type="file"
                    accept=".json,.csv,.xml"
                    onChange={importTasks}
                />
            </div>
        </div>
    );
}
