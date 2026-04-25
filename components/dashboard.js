import { supabase } from "../utils/supabaseClient";
import Navbar from "./navbar";
import React from "react";
import Contdash from "./contdash";
import { useContext } from "react";



const dashboard = () => {


  return (
    <>
      <Navbar />
      
<div>
          <h1 className="text-2xl font-bold mb-4 text-center">Dashboard</h1>
        </div>
      
      <Contdash />
    </>
  );
};

export default dashboard;
