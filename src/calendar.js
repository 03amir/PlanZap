import React, { useState, useContext, useEffect } from "react";
import "./CSSComponents/calendarstyle.css";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "react-modal";
import Axios from "axios";
import { usercontext } from "./Context/usercontext";
import EditIcon from "@mui/icons-material/Edit";
import { dividerClasses } from "@mui/material";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import "./CSSComponents/delete.css";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneAllIcon from "@mui/icons-material/DoneAll";
const { format } = require("date-fns");

Modal.setAppElement("#root");

const Calender = (props) => {
  const [taskname, settask] = useState("");
  const [priority, setpriority] = useState("");
  const [deadline, setdeadline] = useState("");
  const [isPopup, setPopup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { userid, setuserid } = useContext(usercontext);
  const [isLoading, setLoading] = useState(true);
  const today = new Date().toISOString().split('T')[0];

  const [tasklist, settasklist] = useState([]);
  const [progress, setprogress] = useState();

  const deletetask = (id) => {
    Axios.delete(`https://planzap.herokuapp.com/deletetask/${id}`).then(
      (response) => {
        settasklist(
          tasklist.filter((val) => {
            return val.taskid !== id;
          })
        );
      }
    );
  };

  const taskComplete = (id) => {
    //when finishes a task, confetti celeb action
    props.setConfetti(true);

    Axios.delete(`https://planzap.herokuapp.com/deletetask/${id}`).then(
      (response) => {
        settasklist(
          tasklist.filter((val) => {
            return val.taskid !== id;
          })
        );
      }
    );

    //after 5s remove confetti and delete task
    setTimeout(() => {
      props.setConfetti(false);
    }, 5000);
  };

  function toggleModal() {
    setIsOpen(!isOpen);
  }
  useEffect(() => {
    setLoading(true);

    Axios.post("https://planzap.herokuapp.com/gettaskdata", {
      userid: userid,
    }).then((response) => {
      settasklist(response.data);
    });
    setLoading(false);
  }, []);

  const addtask = () => {
    Axios.post("https://planzap.herokuapp.com/addtask", {
      taskname: taskname,
      priority: priority,
      deadline: deadline,
      userid: userid,
    }).then(() => {
      Axios.post("https://planzap.herokuapp.com/gettaskdata", {
        userid: userid,
      }).then((response) => {
        settasklist(response.data);
      });
      console.log(typeof deadline);
      console.log("success");
    });
  };
  const updateprogess = (id) => {
    Axios.put("https://planzap.herokuapp.com/updateprog", {
      id: id,
      progress: progress,
    }).then((response) => {
      console.log("updated");
    });
  };

  const mystyle = {
    color: "black",
    backgroundColor: "coral",

    fontFamily: "Arial",
    display: " flex",
    flexDirection: "column",
    width: "85vw",
    marginLeft: "15vw",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
  };

  if (isLoading) {
    return (
      <div style={mystyle}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="calpage">
      <div className="toppart">
        {tasklist.map((val, index) => {
          return (
            <div
              key={index}
              className={
                val.priority === "Highest Priority"
                  ? "taskbox"
                  : val.priority === "Medium Priority"
                  ? "mediumtaskbox"
                  : "lowtaskbox"
              }
            >
              <div
                className="toppar2"
                style={{
                  width: "13vw",
                  marginTop: "0vh",
                  paddingTop: "0.5vh",
                  height: "4vh",
                  fontSize: "2vh",
                }}
              >
                <span
                  className="forhover"
                  style={{
                    width: "1.3vw",
                    height: "1.4vw",
                    marginRight: "11vw",
                    padding: "0.5vh",
                    fontSize: "2vh",
                  }}
                >
                  {" "}
                </span>
                <span
                  className="forhover"
                  style={{ width: "2vw", height: "2vw" }}
                >
                  {" "}
                  <CloseIcon
                    onClick={() => {
                      setPopup(true);
                    }}
                    style={{ width: "1.6vw", height: "1.6vw" }}
                  />
                </span>

                <Modal
                  isOpen={isPopup}
                  onRequestClose={() => {
                    setPopup(false);
                  }}
                  style={{
                    overlay: {
                      backgroundColor: "rgba(0, 0, 0, 0.75)",
                    },
                    content: {
                      width: "35vw",
                      height: "45vh",
                      margin: "auto",
                      padding: "1%",
                      borderRadius: "7px",
                      backgroundColor: "white",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-around",
                    },
                  }}
                  centered
                >
                  <CancelIcon className="cross" />
                  <h2 className="delete-message">
                    Do you want to delete the task?
                  </h2>
                  <div className="delete-btns">
                    <button
                      onClick={() => {
                        deletetask(val.taskid);
                        setPopup(false);
                      }}
                      className="popupBtn confirm-btn"
                      style={{ backgroundColor: "red" }}
                    >
                      confirm
                    </button>

                    <button
                      onClick={() => {
                        setPopup(false);
                      }}
                      className="popupBtn cancel-btn"
                    >
                      cancel
                    </button>
                  </div>
                </Modal>
              </div>
              <div
                style={{
                  height: "10vh",
                  width: "13vw",
                  fontStyle: "italic",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "2vh",
                }}
              >
                {val.taskname}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "13vw",
                  fontWeight: "bolder",
                  fontSize: "2.1vh",
                }}
              >
                {" "}
                Task Progress
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "13vw",
                  fontSize: "2vh",
                }}
              >
                <Box style={{ textAlign: "center" }} width={150}>
                  <Slider
                    size="small"
                    defaultValue={val.progress}
                    aria-label="Small"
                    valueLabelDisplay="auto"
                    onChange={(event) => {
                      setprogress(event.target.value);
                      updateprogess(val.taskid);
                    }}
                    onChangeCommitted={(event) => {
                      setprogress(event.target.value);
                      updateprogess(val.taskid);
                    }}
                    style={{ width: "10vw" }}
                  />
                </Box>
              </div>{" "}
              <div
                style={{
                  height: "7vh",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "2vh",
                }}
              >
                Deadline : {format(new Date(val.deadline), "PPPP")}
              </div>
              <div
                style={{
                  height: "5vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  className="buthover"
                  style={{
                    fontSize: "2vh",
                    borderRadius: "15%",
                    width: "4vw",
                    textAlign: "center",
                  }}
                  onClick={() => {
                    taskComplete(val.taskid);
                  }}
                >
                  Done
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bottompart">
        <div className="prioritydesc">
          <div className="redbox"></div>
          High Priority
        </div>
        <div className="prioritydesc">
          <div className="yellowbox"></div>
          Medium Priority
        </div>
        <div className="prioritydesc">
          <div className="violetbox"></div>
          Low Priority
        </div>

        <div className="newtaskbutton" onClick={toggleModal}>
          Add new task
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        contentLabel="My dialog"
        style={{
          overlay: {
            backgroundColor: "rgba(255, 255, 255, 0.75)",
          },
          content: {
            width: "45vw",
            height: "43vh",
            margin: "auto",
            padding: "0",
            borderRadius: "10px",
            backgroundImage:
              "linear-gradient(to top left,grey, rgb(200, 187, 0))",

            display: "flex",
            flexDirection: "column",
            overflowX: "hidden",
          },
        }}
        centered
      >
        <div>
          <div className="topbar">
            <span className="crossbutton" onClick={toggleModal}>
              <CloseIcon />
            </span>
          </div>
          <div className="formarea">
            <label
              style={{ fontSize: "2.2vh", marginBottom: "0vh" }}
              htmlFor="taskname"
            >
              Task Name
            </label>
            <input
              type="text"
              id="taskname"
              maxLength="50"
              name="taskname"
              className="fields"
              placeholder="Max Characters:32"
              onChange={(event) => {
                settask(event.target.value);
              }}
              required
            />

            <label
              style={{ fontSize: "2.2vh", marginTop: "1vh" }}
              htmlFor="date"
            >
              Deadline
            </label>

            <input
              type="date"
              id="date"
              name="date"
              className="fields"
              min={today}
              onChange={(event) => {
                setdeadline(event.target.value);
              }}
              required
            />

            <label style={{ fontSize: "2.2vh" }} htmlFor="priority">
              Priority
            </label>
            <select
              id="priority"
              name="country"
              className="fields"
              onChange={(event) => {
                setpriority(event.target.value);
              }}
              required
            >
              <option></option>

              <option value="Highest Priority">Highest Priority</option>
              <option value="Medium Priority">Medium Priority</option>
              <option value="Low Priority">Low Priority</option>
            </select>
            <input
              type="submit"
              value="Submit"
              className="subbut"
              style={{ marginTop: "1.5vh", fontSize: "2vh" }}
              onClick={() => {
                addtask();
                toggleModal();
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default Calender;
