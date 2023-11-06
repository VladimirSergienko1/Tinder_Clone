import TinderCard from "react-tinder-card";
import { useEffect, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useRef } from "react";
import "./index.css";
import ReactModal from "react-modal";
import UserProfile from "./UserProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [genderedUsers, setGenderedUsers] = useState(null);
  const [lastDirection, setLastDirection] = useState();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [lastSwipedUsers, setLastSwipedUsers] = useState([]);
  const cardsRefs = useRef([]);
  const [lastSwipeDirection, setLastSwipeDirection] = useState(null);
  const [swipeCancelled, setSwipeCancelled] = useState(false);

  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  function openModal(user) {
    setModalContent(user);
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const tinderCardRef = useRef();

  const onSwipe = (direction) => {
    setLastSwipeDirection(direction);

    if (direction === "right" && !swipeCancelled) {
      updateMatches();
    }
  };
  const swipe = (direction) => {
    tinderCardRef.current.swipe(direction);
  };

  const restoreCard = () => {
    tinderCardRef.current.restoreCard();
  };

  const undoSwipe = () => {
    tinderCardRef.current.restoreCard();
  };

  const userId = cookies.UserId;

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/user", {
        params: { userId },
      });
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getGenderedUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/gendered-users", {
        params: { gender: user?.gender_interest },
      });
      setGenderedUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      getGenderedUsers();
    }
  }, [user]);

  const updateMatches = async (matchedUserId) => {
    try {
      await axios.put("http://localhost:8000/addmatch", {
        userId,
        matchedUserId,
      });
      getUser();
    } catch (err) {
      console.log(err);
    }
  };

  const swiped = (direction, swipedUserId) => {
    if (direction === "right") {
      updateMatches(swipedUserId);
    }
    setLastDirection(direction);
    setLastSwipedUsers([...lastSwipedUsers, swipedUserId]);
  };

  const outOfFrame = (name) => {
    console.log(name + " left the screen!");
  };

  const matchedUserIds = user?.matches
    .map(({ user_id }) => user_id)
    .concat(userId);

  const filteredGenderedUsers = genderedUsers?.filter(
    (genderedUser) => !matchedUserIds.includes(genderedUser.user_id)
  );

  console.log("filteredGenderedUsers ", filteredGenderedUsers);

  return (
    <>
      {user && (
        <div className="dashboard">
          <ChatContainer user={user} />
          <div className="swipe-container">
            <div className="card-container">
              {filteredGenderedUsers?.map((genderedUser) => (
                <TinderCard
                  ref={tinderCardRef}
                  className="swipe"
                  key={genderedUser.user_id}
                  onSwipe={(dir) => swiped(dir, genderedUser.user_id)}
                  onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}
                  onClick={() => openModal(genderedUser)}
                >
                  <div
                    style={{ backgroundImage: "url(" + genderedUser.url + ")" }}
                    className="card"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(genderedUser);
                    }}
                  >
                    <h3 className="card-title">{genderedUser.first_name}</h3>
                  </div>
                </TinderCard>
              ))}

              <div className="buttons">
                <button onClick={() => swipe("left")}>Swipe Left</button>
                <button onClick={() => swipe("right")}>Swipe Right</button>
                <button onClick={undoSwipe}>Undo Swipe</button>
              </div>

              <ReactModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="User Info"
                style={{
                  content: {
                    position: "initial",
                    inset: "initial",
                    border: "none",
                    background: "none",
                    overflow: "visible",
                    borderRadius: "initial",
                    outline: "none",
                    padding: "0",
                  },
                }}
              >
                <div
                  className="close-icon"
                  onClick={closeModal}
                  style={{
                    cursor: "pointer",
                    left: "1280px",
                    top: "115px",
                    position: "absolute",
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </div>
                <UserProfile user={modalContent} />
              </ReactModal>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Dashboard;
