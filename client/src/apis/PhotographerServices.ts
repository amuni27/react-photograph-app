import { Response } from "../types/response";
import baseURL from "./baseURL";
import axios from "axios";

// get Photgraphers
export const getPhotographers = async () => {
  try {
    const res : Response = await axios.get(baseURL);
    if (res.status === 200) {
        return res.data;
    }
  } catch (error) {console.log(error)}
  return null
};

//get 