import "./CSSComponents/App.css";
import React, { useState, useEffect } from "react";
import Login from "./loginpage";
import Profile from "./profpage";
import { Routes, Route, Link, DefaultRoute, Navigate } from "react-router-dom";
//import { useHistory } from "react-router-dom";
import Calender from "./calendar";
import Pgraphs from "./pgraphs";
import Loader from "./LoadingScreen";
import Movies from "./movies";
import Ideas from "./ideas";
import Diary from "./diary";
import { NavLink } from "react-router-dom";
import TaskIcon from "@mui/icons-material/Task";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import EditIcon from "@mui/icons-material/Edit";
import ListAltIcon from "@mui/icons-material/ListAlt"
import { usercontext } from "./Context/usercontext";
import LogoutIcon from "@mui/icons-material/Logout";
import Axios from "axios";
import Modal from "react-modal";
import ConfettiCeleb from "./ConfettiCeleb";
import MaintenanceImg from "./CSSComponents/maintenance.svg";
import HowToUse from './HowToUse'

Modal.setAppElement("#root");

function App() {
  Axios.defaults.withCredentials = true;

  const [confetti, setConfetti] = useState(false);
  const [notloggedin, setloginstatus] = useState(true);
  const underMaintenance = false;
  const [userquote, setuserquote] = useState(null);
  const [usernewquote, setnewuserquote] = useState(null);
  const [userid, setuserid] = useState(0);
  const [loading, setloading] = useState(true);
  const [logoutstatus, setlogout] = useState(false);
  //const history=useHistory();
  const [isOpen, setIsOpen] = useState(false);

  function toggleModal() {
    setIsOpen(!isOpen);
  }

  const logout = () => {
    setlogout(true);
    setloginstatus(true);
    setloading(true);
    Axios.put("https://planzap.herokuapp.com/logout", { status: true }).then(
      (response) => {
        setloginstatus(true);
        setloading(false);
      }
    );
  };

  //loggedin=
  useEffect(() => {
    Axios.get("https://planzap.herokuapp.com/slogin").then((response) => {
      if (response.data.loggedin === true && logoutstatus === false) {
        setloginstatus(false);
        setuserid(response.data.user.userid);
        console.log("user ID :" + userid);
      }
      setloading(false);
    });
    Axios.post("https://planzap.herokuapp.com/getquote", {
      userid: userid,
    }).then((response) => {
      setuserquote(response.data.userquote);
      console.log(userquote);
    });
  });
  const updateuserquote = () => {
    console.log(userid + " ok " + userquote);
    Axios.put("https://planzap.herokuapp.com/updatequote", {
      id: userid,
      userquote: usernewquote ? usernewquote : userquote,
    }).then((response) => {
      Axios.post("https://planzap.herokuapp.com/getquote", {
        userid: userid,
      }).then((response) => {
        setuserquote(response.data.userquote);
        console.log(userquote);
      });
      console.log("updated");
    });
  };
  console.log("user ID 2 :" + userid);
  return (
    <div>
      {underMaintenance ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <img
            src={MaintenanceImg}
            alt="Maintenance"
            style={{
              height: "450px",
              width: "auto",
              marginTop: "3rem",
              paddingLeft: "1rem",
              paddingRight: "1rem",
            }}
          />
          <h1 style={{ fontSize: "48px", textAlign: "center" }}>
            We're under maintenance now!👨‍🔧
          </h1>
          <p
            style={{
              fontSize: "24px",
              marginTop: "0",
              marginBottom: "0",
              textAlign: "center",
            }}
          >
            We expect this work to last about 1 hour. For any queries, please
            contact us via email at saraswatmajumder@gmail.com.
          </p>
          <p
            style={{
              fontSize: "24px",
              marginTop: "0",
              marginBottom: "0",
              textAlign: "center",
            }}
          >
            We apologize for any inconvenience.
          </p>
        </div>
      ) : (
        <div className="App">
          {confetti && <ConfettiCeleb />}

          <usercontext.Provider
            value={{ notloggedin, setloginstatus, userid, setuserid }}
          >
            <Modal
              isOpen={isOpen}
              onRequestClose={toggleModal}
              contentLabel="My dialog2"
              style={{
                overlay: {
                  backgroundColor: "rgba(255, 255, 255, 0.75)",
                },
                content: {
                  width: "30vw",
                  height: "19vh",
                  margin: "auto",
                  padding: "0",
                  borderRadius: "10px",
                  borderColor: "red",
                  backgroundImage:
                    "linear-gradient(to top left, rgba(255,255,255), teal)",

                  paddingLeft: "15px",
                  paddingTop: "15px",
                },
              }}
            >
              <div>
                <label for="quote">New Quote</label>
                <br />
                <textarea
                  id="quote"
                  name="userquote"
                  rows="3"
                  cols="20"
                  maxLength="57"
                  defaultValue={userquote}
                  onChange={(event) => {
                    setnewuserquote(event.target.value);
                  }}
                ></textarea>
                <br />
                <button
                  onClick={() => {
                    updateuserquote();
                    toggleModal();
                  }}
                >
                  Save
                </button>
              </div>{" "}
            </Modal>
            {loading ? (
              <Loader />
            ) : notloggedin ? (
              <Login />
            ) : (
              <div>
                {" "}
                <div className="sidebar">
                  {/*      <NavLink to="/Profile" className="barelement" activeClassName="selected">
                     <AccountCircleIcon />
                     &nbsp; &nbsp; Profile
              </NavLink>*/}
                  <div className="quotearea">
                    "{userquote}"<br />
                    <EditIcon className="editbutton" onClick={toggleModal} />
                  </div>
                  <NavLink
                    to="/TasksandProgress"
                    className={({ isActive }) =>
                      `link ${
                        isActive
                          ? "selected"
                          : // Couldn't do this before!
                            "barelement"
                      }`
                    }
                  >
                    <TaskIcon style={{ height: "2.8vh", marginRight: "1vw" }} />
                    Tasks and Progress
                  </NavLink>
                  {/*  <NavLink to="/Performancegraphs" className="barelement" activeClassName="selected">
                     <ShowChartIcon/>      &nbsp; &nbsp;Performance Graphs
    </NavLink>*/}
              <NavLink
                to="/movieslist"
                className={({ isActive }) =>
                  `link ${
                    isActive
                      ? "selected"
                      : // Couldn't do this before!
                        "barelement"
                  }`
                }
              >
                <FormatListBulletedIcon
                  style={{ height: "2.8vh", marginRight: "1vw" }}
                />{" "}
                Movies to Watch
              </NavLink>
              <NavLink
                to="/diary"
                className={({ isActive }) =>
                  `link ${
                    isActive
                      ? "selected"
                      : // Couldn't do this before!
                        "barelement"
                  }`
                }
              >
                <MenuBookIcon style={{ height: "2.8vh", marginRight: "1vw" }} />{" "}
                Personal Diary <br />
              </NavLink>
              <NavLink
                to="/ideasnotes"
                className={({ isActive }) =>
                  `link ${
                    isActive
                      ? "selected"
                      : // Couldn't do this before!
                        "barelement"
                  }`
                }
              >
                <CollectionsBookmarkIcon
                  style={{ height: "2.8vh", marginRight: "1vw" }}
                />{" "}
                Ideas and Notes <br />
              </NavLink>
              <NavLink
                to="/howtouse"
                className={({ isActive }) =>
                  `link ${
                    isActive
                      ? "selected"
                      : // Couldn't do this before!
                        "barelement"
                  }`
                }
              >
                <ListAltIcon
                  style={{ height: "2.8vh", marginRight: "1vw" }}
                />{" "}
               How To Use <br />
              </NavLink>
              <div
                className="logout"
                onClick={logout}
                style={{ fontSize: "2.1vh" }}
              >
                <LogoutIcon style={{ height: "2.8vh", marginRight: "1vw" }} />{" "}
                Log Out{" "}
              </div>
            </div>
            <div>
              <Routes>
                ]
                <Route path="/" element={<Calender setConfetti={setConfetti} />} />
                <Route path="/Profile" element={<Profile />}></Route>
                <Route path="/TasksandProgress" element={<Calender setConfetti={setConfetti}  />}></Route>
                <Route path="/diary" element={<Diary />}></Route>
                <Route path="/movieslist" element={<Movies />}></Route>
                <Route path="/ideasnotes" element={<Ideas />}></Route>
                <Route path="/howtouse" element={<HowToUse />}></Route>
              </Routes>
            </div>
          </div>
        )}
      </usercontext.Provider>
    </div>
      )} </div>
  );
}

export default App;
