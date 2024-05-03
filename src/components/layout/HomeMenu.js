"use client";
import Image from "next/image";
import MenuItem from "../menu/MenuItem";
import SectionHeaders from "./SectionHeaders";
import axios from "axios";
import { useEffect, useState } from "react";

export default function HomeMenu() {
  const [bestSellers, setBestSellers] = useState([]);
  useEffect(() => {
    axios.get("/api/menu-item").then((res) => {
      if (res.data) {
        setBestSellers(res.data.data.slice(0, 3));
      }
    });
  }, []);

  return (
    <section className="">
      <div className="absolute left-0 right-0 w-full justify-start">
        <div className="absolute left-0 -top-[70px] text-left -z-10">
          <Image src={"/sallad1.png"} alt="salad1" width={109} height={189} />
        </div>
        <div className="absolute -top-[100px] right-0 -z-10">
          <Image src={"/sallad2.png"} alt="salad2" width={107} height={195} />
        </div>
      </div>
      <div className="text-center">
        <SectionHeaders header={"Our Best Sellers"} subHeader={"check out"} />
      </div>
      <div className="grid grid-cols-3 gap-4 mt-3">
        {bestSellers.length > 0 &&
          bestSellers.map((item) => <MenuItem {...item} />)}
      </div>
    </section>
  );
}
