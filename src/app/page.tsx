"use client";
import { useState } from "react";
import { fetchTokenForTask } from "./helpers/fetchTokenForTask";

export default function Home() {
  const [token, setToken] = useState("");

  const displayToken = async () => {
    try {
      const fetchedToken = await fetchTokenForTask("helloapi");
      if (fetchedToken) {
        setToken(fetchedToken);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <p onClick={displayToken}>fetch token</p>
      {token && <p>token fetched: {token}</p>}
    </>
  );
}
