import { useState } from "react";
import navbar from "@/json/navbar.json";
import { Link } from "@tanstack/react-router";
import style from "./Navbar.module.scss";

export default function Navbar() {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={style.container}>
      <div className={`${style.bar} ${expanded ? style.expanded : ""}`}>
        {navbar.map((nav, index) => (
          <Link to={nav.path} key={index} className={style.link}>
            {nav.title}
          </Link>
        ))}
      </div>
      <button className={style.circle} onClick={toggleExpanded}>
        L
      </button>
    </div>
  );
}
