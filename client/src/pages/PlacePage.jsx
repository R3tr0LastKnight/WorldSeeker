import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
// import { Link } from "react-router-dom";
import BookingWidget from "../Components/BookingWidget";
import Image from "../Components/Image";

const PlacePage = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then((response) => {
      setPlace(response.data);
    });
  }, [id]);

  if (!place) {
    return "";
  }
  if (showAllPhotos === true) {
    return (
      <div className="absolute bg-black text-white min-h-screen inset-0">
        <div className="p-8 grid gap-4 bg-black">
          <div className="">
            <h2 className="font-bold text-3xl">Photos of {place.title}</h2>
            <button
              onClick={() => {
                setShowAllPhotos(false);
              }}
              true
              className="fixed flex right-4 top-12 gap-1 py-2 px-4 rounded-2xl bg-white text-black shadow-md shadow-black "
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Close Photos
            </button>
          </div>
          {place?.photos?.length > 0 &&
            place.photos.map((photo) => (
              <div>
                <Image src={photo} alt="" />
              </div>
            ))}
        </div>
      </div>
    );
  }
  return (
    <div className="mt-6 ">
      <h1 className="text-4xl">{place.title}</h1>
      <a
        target="_blank"
        href={"https://maps.google.com/?q=" + place.address}
        className=" font-semibold underline mt-2 mb-4 flex "
        rel="noreferrer"
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
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
        {place.address}
      </a>
      <div className="relative">
        <div className="grid gap-2 grid-cols-[2fr_1fr] my-2 rounded-3xl overflow-hidden">
          <div>
            {place.photos?.[0] && (
              <Image
                onClick={() => {
                  setShowAllPhotos(true);
                }}
                className="aspect-square object-cover h-full cursor-pointer "
                src={place.photos?.[0]}
                alt=""
              />
            )}
          </div>
          <div className="grid gap-2">
            {place.photos?.[1] && (
              <Image
                onClick={() => {
                  setShowAllPhotos(true);
                }}
                className="aspect-square object-cover cursor-pointer "
                src={place.photos?.[1]}
                alt=""
              />
            )}
            {place.photos?.[2] && (
              <Image
                onClick={() => {
                  setShowAllPhotos(true);
                }}
                className="aspect-square object-cover cursor-pointer "
                src={place.photos?.[2]}
                alt=""
              />
            )}
          </div>
        </div>
        <button
          onClick={() => setShowAllPhotos(true)}
          className="flex gap-1 absolute bottom-2 right-2 bg-white py-2 px-4 rounded-2xl shadow-black shadow-md"
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
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          Show More Photos
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] mt-4 gap-8">
        <div>
          <div className="my-4">
            <h2 className="font-bold text-2xl mb-1">Description</h2>
            {place.description}
          </div>
          <div>
            <b>CheckIn :</b> {place.checkIn}
            <br />
            <b>CheckOut :</b> {place.checkOut}
            <br />
            <b>Max number of guests :</b>
            {place.maxGuests}
            <br />
            <b>Bonus Condition :</b> {place.extraInfo}
          </div>
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
    </div>
  );
};

export default PlacePage;
