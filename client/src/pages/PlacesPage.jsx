import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountNav from "../Components/AccountNav";
import axios from "axios";
import PlaceImg from "../Components/PlaceImg";

const PlacesPage = () => {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/user-places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);
  return (
    <div>
      <AccountNav />
      <div className="text-center">
        <Link
          className="inline-flex  bg-primary gap-1 text-white py-2 px-6 rounded-full "
          to={"/account/places/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add new Place
        </Link>
      </div>
      <div className="mt-4">
        {places.length > 0 &&
          places.map((place) => (
            <Link
              to={"/account/places/" + place._id}
              className="bg-gray-300 p-4 my-2 rounded-2xl flex items-center gap-4 cursor-pointer"
            >
              <div className="flex items-center w-48 h-32 overflow-hidden shrink-0">
                <PlaceImg place={place} />
              </div>
              <div className="grow-0 shrink ">
                <h2 className="text-xl ">{place.title}</h2>
                <p className="text-sm mt-2"> {place.description}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default PlacesPage;
