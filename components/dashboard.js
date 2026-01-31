import { supabase } from "../utils/supabaseClient";
import Navbar from "./navbar";
import React from "react";
import Contdash from "./contdash";
import { useContext } from "react";



const dashboard = () => {


  return (
    <>
      <Navbar />
      <Contdash />
    </>
  );
};

export default dashboard;
