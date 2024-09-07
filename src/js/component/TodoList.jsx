import React, { useState, useEffect } from "react";

export const TodoList = () => {
  const host = "https://playground.4geeks.com/todo";

  const [createUser, setCreateUser] = useState("");
  const [getUser, setGetUser] = useState("");
  const [userData, setUserData] = useState();
  const [todoItem, setTodoItem] = useState("");

  //handlers
  const handleAddNewUsername = (event) => {
    setCreateUser(event.target.value);
  };

  const handleGetUserInputChange = (event) => {
    setGetUser(event.target.value);
  };

  const handleAddTodo = async (event) => {
    setTodoItem(event.target.value);
    if (event.key === "Enter" && todoItem.trim() !== "") {
      const uri = `${host}/todos/${userData.name}`;
      const dataToSend = { label: todoItem, is_done: false };
      const response = await fetch(uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        console.log("Error adding todo:", response.status, response.statusText);
        return;
      }

      const data = await response.json();
      console.log("Todo added:", data);
      setTodoItem(""); // Clear the input field

      // Refresh the user data to display the updated todo list
      await fetchUser(userData.name);
    }
  };

  const handleDeleteUserButton = async () => {
    const uri = `${host}/users/${userData.name}`;
    const options = {
      method: "DELETE",
    };
    try {
      const response = await fetch(uri, options);
      if (!response.ok) {
        console.log(
          "Error deleting user:",
          response.status,
          response.statusText
        );
        return;
      }
      console.log(`User ${userData.name} deleted successfully.`);
      setUserData(null);
    } catch (error) {
      console.error("An error occurred while deleting the user:", error);
    }
  };

  const handleDeleteTodo = async () => {
    const uri = `${host}/todos/${userData.id}`;
    const options = {
      method: "DELETE",
    };

    try {
      const response = await fetch(uri, options);
      if (!response.ok) {
        console.log(
          "Error deleting todo:",
          response.status,
          response.statusText
        );
        return;
      }
      console.log(`To-do with ID ${todoId} deleted successfully.`);

      // update state on list
      setUserData((prevUserData) => ({
        ...prevUserData,
        todos: prevUserData.todos.filter((todos) => todos.id !== todosId),
      }));
    } catch (error) {
      console.error("An error occurred while deleting the to-do item:", error);
    }
  };

  //POST request
  const handleCreateUserButton = async (event) => {
    event.preventDefault();
    const uri = `${host}/users/${createUser}`;
    const dataToSend = { name: createUser };
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });
    const data = await response.json();
    console.log("User created:", data);
    setCreateUser("");
    await fetchUser(createUser);
  };

  //once POST is done, GET username to update list
  const fetchUser = async (username) => {
    const uri = `${host}/users/${username}`;
    const options = {
      method: "GET",
    };
    const response = await fetch(uri, options);
    if (!response.ok) {
      console.log("Error: ", response.status, response.statusText);
      return;
    }
    const data = await response.json();
    console.log(data);
    setUserData(data);
  };

  //GET request DONE
  const handleGetUserButton = async () => {
    const uri = `${host}/users/${getUser}`;
    const options = {
      method: "GET",
    };
    const response = await fetch(uri, options);
    if (!response.ok) {
      console.log("Error: ", response.status, response.statusText);
      return;
    }
    const data = await response.json();
    console.log(data);
    setUserData(data);
    setGetUser("");
  };

  // PUT request
  const handleItem = async () => {
    const uri = `${host}/users/${userData.label}`;
    const options = {
      method: "POST",
    };
  };
  // JSX
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>To-Do List</h1>
        </div>
      </div>
      {/* CREATE USER BUTTON */}
      <div className="row">
        <div className="col">
          <input
            className="button"
            type="button"
            value="Create User"
            onClick={handleCreateUserButton}
            disabled={!createUser.trim()}
          />
          {/* CREATE USER form */}
          <input
            type="text"
            placeholder="add new username"
            value={createUser}
            onChange={handleAddNewUsername}
          />
        </div>
      </div>
      {/* RETRIEVE USER BUTTON */}
      <div className="row">
        <div className="col">
          <input
            className="button"
            type="button"
            value="Retrieve User"
            onClick={handleGetUserButton}
            disabled={!getUser.trim()}
          />
          {/* RETRIEVE USER form */}
          <input
            type="text"
            value={getUser}
            onChange={handleGetUserInputChange}
            placeholder="add existing username"
          />
        </div>
      </div>

      {/*CONDITIONAL DISPLAY FOR CURRENT USER*/}
      {userData && (
        <div>
          <div className="row">
            <div className="col d-flex">
              <h2>User: {userData.name} </h2>
              <span>
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={handleDeleteUserButton}
                >
                  Delete User
                </button>
              </span>
            </div>
          </div>

          {/* ADD TO-DO Item */}
          <div className="row">
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="add a to-do item"
                value={todoItem}
                onChange={handleAddTodo}
                onKeyDown={handleAddTodo}
              />
            </div>
          </div>
          {/* DISPLAY TO-DO items */}
          <div className="row">
            <div className="col">
              <ul>
                {userData.todos.map((todo) => {
                  return (
                    <li key={todo.id}>
                      {todo.label}
                      <span onClick={handleDeleteTodo(todos.id)}>
                        <i className="fa-solid fa-circle-minus"></i>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          {/* TO-DO items left */}
          <div className="row">
            <div className="col">
              <p>
                {userData.todos.length} item
                {userData.todos.length === 1 ? "" : "s"} left
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
