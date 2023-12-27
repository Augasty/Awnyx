/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { db } from "../../../../firebase";
import { collection, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import styles from "./TaskChange.module.css";
import { useProjectContexts } from "../../../../utils/ProjectContexts";

const TaskChange = ({ currentTask }) => {
  const {currentboard} = useProjectContexts();
  const currentTaskRef = doc(db,"boards",currentboard[0],"taskList",currentTask.id);


  const [formData, setFormData] = useState({
    ...currentTask
  });
  const history = useNavigate();

  console.log(formData)

  const fetchData = async (docId) => {
    if (!currentboard||currentboard.length === 0) {
      return;
    }
    console.log("noti is triggered, and all data is fetched");
    try {
      const taskListRef = collection(db, "boards", currentboard[0], "taskList");

      if (docId) {
        // Fetch a specific document by ID
        const docSnap = await getDoc(doc(taskListRef, docId));

        if (docSnap.exists()) {
          setFormData({
            id: docSnap.id,
            ...docSnap.data(),
          })


        } else {
          console.log("Document not found");
        }
      }
    } catch (error) {
      console.error("Error fetching tasks from Firebase:", error);
    }
  };
  useEffect(() => {
    const tasksRef = doc(db, "boards", currentboard[0], "taskList", currentTask.id);

    const unsub = onSnapshot(tasksRef, () => {
      fetchData(currentTask.id);


    });

    return () => unsub();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentboard]);



  // Function to handle form changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(currentTaskRef, {
      ...currentTask,
      ...formData,
    });
    history("/");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>{formData.title}</h2>
        <label htmlFor="title" className={styles.label}>
          Task Title
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </label>

        <label htmlFor="content" className={styles.label}>
          Task Content
          <textarea
            id="content"
            value={formData.content}
            onChange={handleChange}
            required
            className={styles.textarea}
          />
        </label>

        <label htmlFor="createdAt" className={styles.label}>
          Deadline
          <input
            type="text"
            id="createdAt"
            value={formData.deadline}
            onChange={handleChange}
            readOnly
            className={styles.input}
          />
        </label>



        <label htmlFor="priority" className={styles.label}>
          Priority
          <select
            id="priority"
            value={formData.priority}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label htmlFor="taskStatus" className={styles.label}>
          Task Status
          <select
            id="taskStatus"
            value={formData.taskStatus}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="new">New</option>
            <option value="inProgress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </form>
    </>
  );
};

export default TaskChange;
