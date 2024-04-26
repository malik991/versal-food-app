import { useState, useEffect } from "react";
import axios from "axios";

export function useProfile() {
  const [data, setData] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/profile")
      .then((response) => {
        setData(response?.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching profile data:", error);
      });
  }, []);

  return { loading, data };
}
