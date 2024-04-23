import Link from "next/link";
export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <Link className="text-primary font-bold" href="">
        Al-Rehman Pizza
      </Link>
      <nav className="flex items-center gap-8 text-gray-500 font-semibold">
        <Link href={"/"} className="hover:text-primary">
          Home
        </Link>
        <Link href={"/"} className="hover:text-primary">
          Menu
        </Link>
        <Link href={"/"} className="hover:text-primary">
          About
        </Link>
        <Link href={"/"} className="hover:text-primary">
          Contact
        </Link>
        <Link
          href={"/"}
          className="bg-primary px-8 py-2 text-white rounded-full"
        >
          Login
        </Link>
      </nav>
    </header>
  );
}
