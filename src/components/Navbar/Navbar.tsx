import navbar from "@/json/navbar.json";
import { Link } from "@tanstack/react-router";

export default function Navbar() {
  return (
    <div>
      {navbar.map((nav, index) => (
        <Link to={nav.path} key={index}>
          {nav.title}
        </Link>
      ))}
    </div>
  );
}
