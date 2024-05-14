import Image from "next/image";
import Right, { RounderRight } from "../icons/Right";
export default function Hero() {
  return (
    <section className="hero md:mt-4">
      <div className="pb-8 pt-3 md:py-12">
        <h1 className="text-4xl font-semibold">
          Everything
          <br />
          is better
          <br />
          with a&nbsp;
          <span className="text-primary">Pizza</span>
        </h1>
        <p className="my-6 text-gray-500 text-sm">
          Pizza is the missing piece that makes every day complete, a simple yet
          delicious joy in life
        </p>
        <div className="flex gap-4 text-sm">
          <button className="bg-primary uppercase flex gap-1 items-center hover:bg-slate-500 px-5 py-2 rounded-full text-white">
            Order Now
            <Right />
          </button>
          <button className="bg-slate-500 flex gap-1 hover:bg-primary px-5 py-2 rounded-full text-white">
            Learn More
            <RounderRight />
          </button>
        </div>
      </div>
      <div
        className="relative hidden md:block"
        style={{ width: "100%", height: "400px" }}
      >
        <Image
          className=""
          src={"/pizza.png"}
          fill
          style={{ objectFit: "contain" }}
          alt="Alrehman Pizza"
          priority={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </section>
  );
}
