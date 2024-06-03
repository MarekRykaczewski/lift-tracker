import { useEffect, useState } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";

const Home = () => {
  const [workouts, setWorkouts] = useState([]);
  const [newWorkout, setNewWorkout] = useState({ date: "", notes: "" });

  useEffect(() => {
    getWorkouts();
  }, []);

  const getWorkouts = () => {
    api
      .get("/api/workouts/")
      .then((res) => res.data)
      .then((data) => {
        setWorkouts(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorkout((prevWorkout) => ({
      ...prevWorkout,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem(ACCESS_TOKEN);

    api
      .post("/api/workouts/", newWorkout, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status === 201) {
          setWorkouts((prevWorkouts) => [...prevWorkouts, res.data]);
          setNewWorkout({ date: "", notes: "" });
        }
      })
      .catch((err) => alert(err));
  };

  return (
    <div>
      <h2>Workouts</h2>
      {workouts.map((workout) => (
        <div key={workout.id}>
          <p>{workout.date}</p>
          <p>{workout.notes}</p>
        </div>
      ))}
      <h2>Create a Workout</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={newWorkout.date}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Notes:
            <textarea
              name="notes"
              value={newWorkout.notes}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <button type="submit">Create Workout</button>
      </form>
    </div>
  );
};

export default Home;
