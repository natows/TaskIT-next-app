"use client";
import { useState, useContext } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { UserContext } from "./login/UserContext";
import Attachments from "./[date]/Attachments";

export default function AddTask() {
    const { user } = useContext(UserContext);
    const [attachments, setAttachments] = useState({});

    const validationSchema = Yup.object().shape({
        taskName: Yup.string().required("Please enter a task name."),
        startDate: Yup.date().required("Please enter a start date."),
        endDate: Yup.date()
            .required("Please enter an end date.")
            .min(Yup.ref('startDate'), "End date can't be before start date."),
        priority: Yup.string().required("Please select a priority."),
        description: Yup.string(),
    });

    const handleSubmit = (values, { resetForm }) => {
        if (!user) {
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

        const currentUser = parsedUsers[user.username];

        if (!currentUser) {
            alert("User data not found.");
            return;
        }

        const userId = currentUser.userId;
        const userTasks = localStorage.getItem(userId);
        const parsedUserTasks = userTasks ? JSON.parse(userTasks) : { tasksByDate: {} };

        parsedUserTasks.tasksByDate = parsedUserTasks.tasksByDate || {};

        const startDate = new Date(values.startDate);
        const endDate = new Date(values.endDate);

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const formattedDate = date.toISOString().split('T')[0];

            if (!parsedUserTasks.tasksByDate[formattedDate]) {
                parsedUserTasks.tasksByDate[formattedDate] = { tasks: [], attachments: {} };
            }

            const taskIndex = parsedUserTasks.tasksByDate[formattedDate].tasks.length;
            parsedUserTasks.tasksByDate[formattedDate].tasks.push(newTask);
            parsedUserTasks.tasksByDate[formattedDate].attachments[taskIndex] = attachments[taskIndex] || [];
        }

        localStorage.setItem(userId, JSON.stringify(parsedUserTasks));

        console.log("Task added:", newTask);

        resetForm();
        setAttachments({}); 
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
                validationSchema={validationSchema}
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
                            <ErrorMessage name="endDate" component="div" className="text-red-500 text-sm mt-1" />
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

                        <div className="mb-4">
                            <Attachments taskIndex={0} attachments={attachments} setAttachments={setAttachments} />
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
