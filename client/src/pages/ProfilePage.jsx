import React, { useContext, useState } from "react";
import { UserContext } from "../userContext";
import { Navigate, useParams } from "react-router";

import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../Components/AccountNav";

const ProfilePage = () => {
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  const [redirect, setRedirect] = useState(null);

  const logout = async () => {
    await axios.post("/logout");
    setRedirect("/");
    setUser(null);
  };
  const { user, ready, setUser } = useContext(UserContext);
  if (!ready) {
    return "Loading...";
  }

  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  //
  if (redirect) {
    return <Navigate to={redirect}></Navigate>;
  }
  return (
    <div>
      <AccountNav />
      {/* profile */}
      {subpage === "profile" && (
        <div className="text-center max-w-xs  mx-auto">
          Logged in as {user.name} ( {user.email} ) <br />
          <button
            onClick={logout}
            className="bg-primary text-white w-full py-1 rounded-xl mt-2"
          >
            LOGOUT
          </button>
        </div>
      )}

      {/* Accomodations */}
      {subpage === "places" && (
        <div>
          <PlacesPage />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
