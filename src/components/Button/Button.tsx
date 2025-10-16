import React from "react";
import style from "./Button.module.scss";
import clsx from "clsx";

interface ButtonProps {
  title: string;
  icon?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isPrimary?: boolean;
}

export default function Button({
  title,
  icon,
  onClick,
  isPrimary,
}: ButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        style.Button,
        isPrimary ? style.Primary : style.Secondary
      )}
      onClick={onClick}
    >
      <span className={style.Text}>{title}</span>
      {icon && <span className={style.Icon}>{icon}</span>}
    </button>
  );
}
