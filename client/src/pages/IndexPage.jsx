import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Image from "../Components/Image";

const IndexPage = () => {
  const [places, stePlaces] = useState([]);
  useEffect(() => {
    axios.get("/places").then((response) => {
      stePlaces(response.data);
    });
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8 gap-x-2 gap-y-6">
      {places.length > 0 &&
        places.map((place) => {
          console.log(
            "https://worldseekerbackend.onrender.com/uploads/" +
              place.photos?.[0]
          );

          return (
            <Link
              to={"/place/" + place._id}
              className="w-[100%] justify-center my-2"
            >
              <div className=" rounded-2xl flex justify-center md:justify-start mb-2 h-[70%]">
                {place.photos?.[0] && (
                  <Image
                    className="rounded-2xl object-cover md:w-[90%]  "
                    src={place.photos?.[0]}
                    alt=""
                  />
                )}
              </div>

              <h2 className=" font-bold leading-4 ml-2">{place.title}</h2>
              <h3 className="text-sm ml-2">{place.address}</h3>
              <div className="mt-1 ml-2">
                <span className="font-bold">${place.price}</span> per Night
              </div>
            </Link>
          );
        })}
    </div>
  );
};

export default IndexPage;
// bjvsc
