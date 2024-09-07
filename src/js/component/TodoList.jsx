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

  //POST user request
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

  //after POST user > GET user to update todo list
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

  //GET user request
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

  // PUT item request
  const handleItem = async () => {
    const uri = `${host}/users/${userData.label}`;
    const options = {
      method: "POST",
    };
  };
  // DELETE item
  const handleDeleteTodo = async (todoId) => {
    const uri = `${host}/todos/${todoId}`;
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
      console.log(`Todo ${todoId} deleted successfully.`);

      // Refresh the user data to reflect the updated todo list
      await fetchUser(userData.name);
    } catch (error) {
      console.error("An error occurred while deleting the todo:", error);
    }
  };

  // JSX
  return (
    <div className="container bg-light p-3">
      <div className="row">
        <div className="col">
          <h1>To-Do List</h1>
        </div>
      </div>
      {/* CREATE USER BUTTON */}
      <div className="row m-2">
        <div className="col">
          <input
            className="button me-3"
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
      <div className="row m-2 pb-2">
        <div className="col">
          <input
            className="button me-2"
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
              <h3>current user: {userData.name} </h3>
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
          <div className="row pt-2">
            <div className="col">
              <input
                type="text"
                className="pb-2 form-control"
                placeholder="add a to-do item"
                value={todoItem}
                onChange={handleAddTodo}
                onKeyDown={handleAddTodo}
              />
            </div>
          </div>
          {/* DISPLAY TO-DO items */}
          <div className="row mx-3">
            <div className="col">
              <ul>
                {userData.todos.map((todo) => {
                  return (
                    <li key={todo.id}>
                      {todo.label}
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteTodo(todo.id)}
                      >
                        <i className="fa-solid fa-circle-minus"></i>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          {/* TO-DO items left */}
          <div className="row py-4">
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
