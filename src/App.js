import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom'
import AddTask from './components/AddTask'
import About from './components/About'
import Header from './components/Header'
import Tasks from './components/Tasks'
import Footer from './components/Footer'
import { useState, useEffect } from 'react'
function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])
  useEffect(() => {
    const getTask = async() => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTask()
  }, [])

// Fetch Task
const fetchTasks = async() => {
  const res = await fetch('http://localhost:5000/tasks')
  const data = await res.json()
  return data
}

const fetchTask = async(id) => {
  const res = await fetch(`http://localhost:5000/tasks/${id}`)
  const data = await res.json()
  return data
}

  // Add Task
  const addTask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)   
    })

    const data = await res.json() 

    setTasks([...tasks, data])
    // const id = Math.floor(Math.random() * 10000) +1 
    // const newTask = {id, ...task}
    // setTasks([...tasks, newTask])
  }

  // DeleteTask
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`,{ method: 'DELETE'})
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updatedTask = {...taskToToggle, reminder: !taskToToggle.reminder}
    console.log(updatedTask)

    const res = await fetch(`http://localhost:5000/tasks/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updatedTask)   
    })

    const data = await res.json()
    setTasks(tasks.map((task) => task.id === id ? {...task, reminder: !task.reminder} : task))
  }
  return (
    <Router>
      <div className="container">
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/>
    
    <Route path='/' exact render ={(props) => (
      <>
  {showAddTask && <AddTask onAdd={addTask} />}
      {tasks.length > 0 ? 
      <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/>
      : 
      <p> You Have no Task</p>
    }
      </>
    )}/>
    <Route path='/about' component={About}/>
    <Footer />
    </div>
    </Router>
  );
}

export default App;
