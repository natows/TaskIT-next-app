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

        parsedUserTasks.tasksByDate[formattedStartDate].tasks.push(newTask);

        localStorage.setItem(userId, JSON.stringify(parsedUserTasks));

        console.log("Task added:", newTask);

        resetForm();
    };

    return (
        <div>
            <h2>Add Task</h2>
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
                        <div>
                            <label htmlFor="taskName">Task Name:</label>
                            <Field
                                type="text"
                                id="taskName"
                                name="taskName"
                                placeholder="Enter task name"
                            />
                            <ErrorMessage name="taskName" component="div" />
                        </div>

                        <div>
                            <label htmlFor="startDate">Start Date:</label>
                            <Field
                                type="date"
                                id="startDate"
                                name="startDate"
                            />
                            <ErrorMessage name="startDate" component="div" />
                        </div>

                        <div>
                            <label htmlFor="endDate">End Date:</label>
                            <Field
                                type="date"
                                id="endDate"
                                name="endDate"
                            />
                        </div>

                        <div>
                            <label htmlFor="description">Description:</label>
                            <Field
                                as="textarea"
                                id="description"
                                name="description"
                                placeholder="Enter task description"
                            />
                        </div>

                        <div>
                            <label htmlFor="priority">Priority:</label>
                            <Field as="select" id="priority" name="priority">
                                <option value="low">Low</option>
                                <option value="normal">Normal</option>
                                <option value="high">High</option>
                            </Field>
                        </div>

                        <button type="submit">Add Task</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
