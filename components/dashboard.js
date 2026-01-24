import { supabase } from "../utils/supabaseClient";
import Navbar from "./navbar";
import React from "react";
import Contdash from "./contdash";

const dashboard = () => {
  return (
    <>
      <Navbar />
      <Contdash />
    </>
  );
};

export default dashboard;
