// React
import type { ReactNode } from "react";

// Styles
import style from "./Section.module.css";

interface Props {
  children: ReactNode;
}

export default function Section({ children }: Props) {
  return <section className={style.section}>{children}</section>;
}
