// Libraries
import { ClipLoader } from "react-spinners";

// Styles
import style from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={style.backdrop}>
      <ClipLoader color="red" size={150} aria-label="Loading Spinner" data-testid="loader" />
    </div>
  );
}
