import React from "react";
import Image from "./Image";

const PlaceImg = ({ place, className = null }) => {
  if (!place.photos?.length) {
    return "";
  }
  if (!className) {
    className = " object-cover ";
  }
  return (
    <div>
      <Image src={place.photos?.[0]} alt="" />
    </div>
  );
};

export default PlaceImg;
