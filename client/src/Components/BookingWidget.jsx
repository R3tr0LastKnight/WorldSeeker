import React, { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
// import axios from "axios";
import { Navigate } from "react-router";
import { UserContext } from "../userContext";

const BookingWidget = ({ place }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const bookThisPlace = async () => {
    // const response = await axios.post("/bookings", {
    //   checkIn,
    //   checkOut,
    //   numberOfGuests,
    //   name,
    //   phone,
    //   place: place._id,
    //   price: numberOfNights * place.price,
    // });
    // const bookingId = response.data._id;
    setRedirect(`/account/bookings`);
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }
  return (
    <div>
      <div className="bg-white shadow shadow-black p-4 rounded-2xl">
        <div className="text-2xl text-center pb-1">
          Price : ${place.price} / night
        </div>
        <div className="border border-gray-400 rounded-2xl mb-2 shadow-xl text-xs md:text-base">
          <div className="flex">
            <div className="py-1 px-2 ">
              <label>Check In :</label>
              <input
                type="date"
                name=""
                id=""
                value={checkIn}
                onChange={(ev) => setCheckIn(ev.target.value)}
              />
            </div>
            <div className="py-1 px-2 border-l border-gray-400">
              <label>Check Out :</label>
              <input
                type="date"
                name=""
                id=""
                value={checkOut}
                onChange={(ev) => setCheckOut(ev.target.value)}
              />
            </div>
          </div>
          <div className="py-1 px-2 flex flex-col border-t border-gray-400">
            <label>Number of Guests :</label>
            <input
              type="number"
              name=""
              id=""
              placeholder="4"
              value={numberOfGuests}
              onChange={(ev) => setNumberOfGuests(ev.target.value)}
            />
          </div>
          {numberOfNights > 0 && (
            <div className="py-1 px-2 flex flex-col border-t border-gray-400">
              <label>Your Full Name :</label>
              <input
                type="text"
                name=""
                id=""
                placeholder="God Usopp"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
              />
              <label>Your Email :</label>
              <input
                type="text"
                name=""
                id=""
                placeholder="God@Usopp.exe"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
              />
              <label>Your Phone Number :</label>
              <input
                type="tel"
                name=""
                id=""
                placeholder="6900742069"
                value={phone}
                onChange={(ev) => setPhone(ev.target.value)}
              />
            </div>
          )}
        </div>
        {numberOfNights > 0 && (
          <div className="flex gap-2 p-4 py-3">
            <div className="font-bold">To pay :</div>
            <span>$ {numberOfNights * place.price * numberOfGuests}/-</span>
          </div>
        )}
        <button className="primary" onClick={bookThisPlace}>
          Book This Place
        </button>
      </div>
    </div>
  );
};

export default BookingWidget;
