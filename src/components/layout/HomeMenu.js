import Image from "next/image";
import MenuItem from "../menu/MenuItem";
import SectionHeaders from "./SectionHeaders";

export default function HomeMenu() {
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
        <SectionHeaders header={"Menu"} subHeader={"check out"} />
      </div>
      <div className="grid grid-cols-3 gap-4 mt-3">
        <MenuItem
          name="Tikka"
          price="04"
          description="It is a long established fact that a reader will be distracted by the
        readable content of a page when looking at its layout"
        />
        <MenuItem />
        <MenuItem />
        <MenuItem />
        <MenuItem />
        <MenuItem />
      </div>
    </section>
  );
}
