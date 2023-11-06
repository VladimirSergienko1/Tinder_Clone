import Nav from "../components/Nav";
import { useCookies } from "react-cookie";

const UserProfile = ({ user }) => {
  const [cookies, setCookie, removeCookie] = useCookies(null);

  return (
    <>
      <Nav minimal={true} setShowModal={() => {}} showModal={false} />

      <div className="modal-container">
        <div className="modal-content">
          <h2>USER PROFILE</h2>

          <section>
            <h3>{user.first_name}</h3>
            <p>
              Birthday: {user.dob_day}/{user.dob_month}/{user.dob_year}
            </p>
            <p>Gender: {user.gender_identity}</p>
            <p>Show gender on profile: {user.show_gender ? "Yes" : "No"}</p>
            <p>Interested in: {user.gender_interest}</p>
            <p>About: {user.about}</p>

            <img className="profile-image" src={user.url} alt="User profile" />
          </section>
        </div>
      </div>
    </>
  );
};
export default UserProfile;
