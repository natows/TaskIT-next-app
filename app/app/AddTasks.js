"use client";
import { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";

export default function AddTask() {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    const validate = (values) => {
        const errors = {};
        if (!values.taskName) {
            errors.taskName = "Please enter a task name.";
        }
        if (!values.startDate) {
            errors.startDate = "Please enter a start date.";
        }
        return errors;
    };

    const handleSubmit = (values, { resetForm }) => {
        if (!currentUser) {
            alert("No user is logged in.");
            return;
        }

        const newTask = {
            name: values.taskName,
            description: values.description,
            priority: values.priority,
            done: false,
        };

        const storedUsers = localStorage.getItem("users");
        const parsedUsers = storedUsers ? JSON.parse(storedUsers) : {};

        const user = parsedUsers[currentUser.username];

        if (!user) {
            alert("User data not found.");
            return;
        }

        const userId = user.userId;
        const userTasks = localStorage.getItem(userId);
        const parsedUserTasks = userTasks ? JSON.parse(userTasks) : { tasksByDate: {} };

        parsedUserTasks.tasksByDate = parsedUserTasks.tasksByDate || {};

        const formattedStartDate = values.startDate;

        if (!parsedUserTasks.tasksByDate[formattedStartDate]) {
            parsedUserTasks.tasksByDate[formattedStartDate] = { tasks: [] };
        }

        console.log('Parsed tasks:', parsedUserTasks);
        
        parsedUserTasks.tasksByDate[formattedStartDate].tasks.push(newTask);

        localStorage.setItem(userId, JSON.stringify(parsedUserTasks));

        console.log("Task added:", newTask);

        resetForm();
    };

    return (
        <div className="p-6 border border-gray-300 rounded-lg shadow-lg h-[300px] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4">Add Task</h2>
            <Formik
                initialValues={{
                    taskName: "",
                    startDate: "",
                    endDate: "",
                    priority: "normal",
                    description: "",
                }}
                validate={validate}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue }) => (
                    <Form>
                        <div className="mb-4">
                            <label htmlFor="taskName" className="block">Task Name:</label>
                            <Field
                                type="text"
                                id="taskName"
                                name="taskName"
                                placeholder="Enter task name"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            <ErrorMessage name="taskName" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="startDate" className="block">Start Date:</label>
                            <Field
                                type="date"
                                id="startDate"
                                name="startDate"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                            <ErrorMessage name="startDate" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="endDate" className="block">End Date:</label>
                            <Field
                                type="date"
                                id="endDate"
                                name="endDate"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="description" className="block">Description:</label>
                            <Field
                                as="textarea"
                                id="description"
                                name="description"
                                placeholder="Enter task description"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="priority" className="block">Priority:</label>
                            <Field as="select" id="priority" name="priority" className="w-full p-2 border border-gray-300 rounded-md">
                                <option value="low">Low</option>
                                <option value="normal">Normal</option>
                                <option value="high">High</option>
                            </Field>
                        </div>

                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-colors">
                            Add Task
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
