// React
import type { ReactNode } from "react";

// Styles
import style from "./Grid.module.css";

interface Props {
  children: ReactNode;
}

export default function Grid({ children }: Props) {
  return <ul className={style.list}>{children}</ul>;
}
