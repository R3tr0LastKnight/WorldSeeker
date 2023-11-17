import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async (ev) => {
    ev.preventDefault();
    try {
      await axios.post("/register", {
        name,
        email,
        password,
      });
      alert("registered successfully, Now you can login");
    } catch (error) {
      alert("register failed");
    }
  };

  return (
    <div className="mt-4 grow flex flex-col items-center justify-around mb-64">
      <div>
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input
            type="text"
            placeholder="Soge King"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <input
            type="email"
            placeholder="god@usopp.exe"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            placeholder="GodUsopp@69"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <button className="bg-blue-300 p-2 w-full text-white rounded-2xl">
            REGISTER
          </button>
          <div className="text-center py-2 text-gray-500">
            Already have an account?{" "}
            <Link className="underline text-black" to={"/login"}>
              Login Here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
