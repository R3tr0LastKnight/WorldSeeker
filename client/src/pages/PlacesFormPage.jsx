import React, { useEffect, useState } from "react";
import Perks from "../Components/Perks";
import PhotosUploder from "../Components/PhotosUploder";
import axios from "axios";
import AccountNav from "../Components/AccountNav";
import { Navigate, useParams } from "react-router";

const PlacesFormPage = () => {
  const { id } = useParams();
  console.log({ id });
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState(false);
  const [price, setPrice] = useState(100);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

  const inputLabel = (text) => {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  };

  const inputDesc = (text) => {
    return <p className="text-gray-500 text-sm">{text}</p>;
  };
  const preInput = (header, desc) => {
    return (
      <>
        {inputLabel(header)}
        {inputDesc(desc)}
      </>
    );
  };

  const savePlace = async (ev) => {
    ev.preventDefault();
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };

    if (id) {
      await axios.put("/places", { id, ...placeData });
      setRedirect(true);
    } else {
      await axios.post("/places", placeData);
      setRedirect(true);
    }
  };

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        {preInput("Title", "Title for your place.")}
        <input
          type="text"
          placeholder="syrup village"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />

        {preInput("Address", "Add address for your Place.")}
        <input
          type="text"
          placeholder="East Blue"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
        />

        {preInput("Photos", "More === better")}
        <PhotosUploder addedPhotos={addedPhotos} onChange={setAddedPhotos} />

        {preInput("Description", "Describe the location.")}
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
          placeholder="Syrup Village is the birthplace of Usopp, and is a peaceful area. The village is located on the Gecko Islands."
        />

        {preInput("Perks", "Select perks that matches your place.")}
        <Perks selected={perks} onChange={setPerks} />

        {preInput("Extra Info", "Basic rules, etc.")}
        <textarea
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        ></textarea>

        {preInput("Check In/Out Times || Max Guests", "Add time windows.")}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4 ">
          <div>
            <h3 className="mt-2 -mb-2">check in time</h3>
            <input
              type="text"
              placeholder="10:00"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-2">check out time</h3>
            <input
              type="text"
              placeholder="00:00"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-2">Max Guests</h3>
            <input
              type="number"
              placeholder="4"
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-2">Price/Night</h3>
            <input
              type="number"
              placeholder="4"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
            />
          </div>
        </div>
        <div>
          <button className="primary my-4">Save</button>
        </div>
      </form>
    </div>
  );
};

export default PlacesFormPage;
