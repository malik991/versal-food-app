"use client";
import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Define loading state

  useEffect(() => {
    const fetchCategories = axios.get("/api/category");
    const fetchMenuItems = axios.get("/api/menu-item");

    const toastId = toast.loading("Menu is Loading ...", {
      id: "loading-toast",
    });

    Promise.all([fetchCategories, fetchMenuItems])
      .then(([categoryRes, menuItemRes]) => {
        if (categoryRes?.data?.length > 0) {
          setCategories(categoryRes?.data);
        } else {
          throw new Error("Failed to fetch categories");
        }

        if (menuItemRes?.data?.success === true) {
          setMenuItems(menuItemRes?.data?.data);
        } else {
          throw new Error(
            menuItemRes?.data?.message || "Failed to fetch menu items"
          );
        }

        //toast.dismiss(toastId); // Dismiss the loading toast
        toast.success("Thanks for waiting", {
          id: toastId,
          duration: 5000,
          icon: "🔥",
          style: {
            minWidth: "250px",
            border: "1px solid #713200",
            padding: "16px",
            color: "#713200",
            position: "top-right",
          },
        });
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((err) => {
        console.error("Error fetching data:", err);

        let errorMessage = "An error occurred while fetching menu.";
        if (err.response && err.response.data && err.response.data.message) {
          errorMessage = `Error: ${err.response.data.message}`;
        } else if (err.message) {
          errorMessage = `Please try again, ${err.message}`;
        }

        //toast.dismiss(toastId); // Dismiss the loading toast
        toast.error(errorMessage, {
          id: toastId,
          icon: "💀",
          duration: 5000,
          style: {
            minWidth: "250px",
            border: "1px solid #713200",
            padding: "16px",
            color: "#713200",
            position: "top-right",
          },
        });
        setLoading(false); // Set loading to false after error
      });
  }, []);
  return (
    <section className="md:mt-8 mt-3">
      {categories?.length > 0 &&
        categories.map((c) => (
          <div key={c._id}>
            <div className="text-center">
              <SectionHeaders header={c.name} />
            </div>
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-3 my-3 md:my-8">
              {menuItems?.length > 0 &&
                menuItems
                  .filter((item) => item.category === c._id)
                  .map((groupOfItem) => (
                    <MenuItem key={groupOfItem._id} {...groupOfItem} />
                  ))}
            </div>
          </div>
        ))}
    </section>
  );
}
