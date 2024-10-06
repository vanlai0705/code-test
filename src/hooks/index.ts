import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const mock = new MockAdapter(axios);

export interface Task {
  id: number;
  name: string;
  check: boolean;
  status: string;
}

const useTaskCreator = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchData = () => {
    const todoTasks = Array.from({ length: 5 }, (_, index) => ({
      id: index + 1,
      name: `Task ${index + 1}`,
      status: index % 2 === 0 ? "Completed" : "Incomplete",
    }));

    mock.onGet("/tasks").reply(200, todoTasks);

    axios
      .get("/tasks")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []); // Run only once on hook mount

  const refetch = () => fetchData();

  const createTask = async (name: string) => {
    try {
      mock.onPost("/tasks").reply((config) => {
        const { name } = JSON.parse(config.data);
        const newTask = { id: tasks.length + 1, name, status: "Incomplete" };

        console.log("New task created:", newTask);
        return [201, newTask];
      });
      const response = await axios.post("/tasks", { name });
      setTasks([...tasks, response.data]);
      toast.success("Create Successful");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      mock.onPut(/\/tasks\/\d+/).reply((config) => {
        const taskId = parseInt(config.url.split("/").pop(), 10);
        const { status } = JSON.parse(config.data);

        const taskIndex = tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
          tasks[taskIndex].status = status;
          return [200, tasks[taskIndex]];
        } else {
          return [404, { message: "Not found" }];
        }
      });

      const response = await axios.put(`/tasks/${taskId}`, {
        status: newStatus,
      });
      console.log(
        `Công việc ${taskId} đã được cập nhật trạng thái thành ${newStatus}`
      );
      toast.success("Update Successful");
      const updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, status: newStatus };
        }
        return task;
      });

      setTasks([...updatedTasks]);

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const filterTasksByStatus = (status: string) => {
    if (status === "ALL") {
      setTasks([...tasks]);
      return;
    }
    const tasksByStatus = tasks.filter((task) => task.status === status);
    setTasks([...tasksByStatus]);
  };

  return {
    tasks,
    refetch,
    createTask,
    updateTaskStatus,
    filterTasksByStatus,
  };
};

export { useTaskCreator };
