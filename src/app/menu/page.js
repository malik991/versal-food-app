"use client";
import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios
      .get("/api/menu-item")
      .then((res) => {
        setMenuItems(res.data.data);
      })
      .catch((error) => {
        console.log("error while fetching All menue Items", error);
        toast.error("Error while fetch All menu");
      });
    axios
      .get("/api/category")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => {
        console.log("error while fetching All categories", error);
        toast.error("Error while fetch All categories");
      });
  }, []);
  return (
    <section className="mt-8">
      {categories.length > 0 &&
        categories.map((c) => (
          <div>
            <div className="text-center">
              <SectionHeaders header={c.name} />
            </div>
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-3 mt-8 mb-8">
              {menuItems?.length > 0 &&
                menuItems
                  .filter((item) => item.category === c._id)
                  .map((groupOfItem) => <MenuItem {...groupOfItem} />)}
            </div>
          </div>
        ))}
    </section>
  );
}
