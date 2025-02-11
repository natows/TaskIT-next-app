"use client";
import { useState } from "react";

export default function SortingTasks({ onSort }) {
    const [sortCriteria, setSortCriteria] = useState("");

    const handleSortChange = (event) => {
        const criteria = event.target.value;
        setSortCriteria(criteria);
        onSort(criteria);
    };

    return (
        <div className="mb-4">
            <label htmlFor="sort" className="mr-2">Sort by:</label>
            <select
                id="sort"
                value={sortCriteria}
                onChange={handleSortChange}
                className="border rounded p-2"
            >
                <option value="">Select</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="priority-high-low">Priority (High to Low)</option>
                <option value="priority-low-high">Priority (Low to High)</option>
                <option value="status">Status</option>
            </select>
        </div>
    );
}