import { useEffect, useState } from "react";
import axios from "axios";
import "./admin.css";

const Admin = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const response = await axios.get("http://localhost:8000/allUsers");
    setUsers(response.data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios
          .delete(`http://localhost:8000/user/${id}`)
          .then(async (response) => {
            await getUsers(); // fetch the users again after successful deletion
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <div className="user-list">
        {users.map((user) => (
          <div className="user-item" key={user.user_id}>
            <img src={user.url} alt="user profile" className="user-image" />
            <div className="user-info">
              <p>
                <strong>Name:</strong> {user.first_name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>
            <button
              className="delete-button"
              onClick={() => deleteUser(user.user_id)}
            >
              Delete User
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
