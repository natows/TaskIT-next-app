"use client";
import DoneTasks from "./DoneTasks";
import TaskExportImport from "./dataFormatting/TaskExportImport";

export default function AccountPage() {
    return (
        <div className="container mx-auto p-6">
            <div className="card bg-white shadow-md rounded-lg p-6 mb-6">
                <h1 className="text-3xl font-bold mb-4">Account Overview</h1>
                <DoneTasks />
            </div>
            <div className="card bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Export/Import Tasks</h2>
                <TaskExportImport />
            </div>
        </div>
    );
}

