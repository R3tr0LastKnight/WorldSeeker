import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

const BookingPage = () => {
  const id = useParams();
  const [booking, setBooking] = useState(null);
  useEffect(() => {
    if (id) {
      axios.get("/bookings").then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return "";
  }

  return <div>1 BookingPage</div>;
};

export default BookingPage;
