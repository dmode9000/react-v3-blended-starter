// React
import { memo } from "react";
import { type FormEvent, useState } from "react";

// Libraries
import { FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";

// Styles
import style from "./Form.module.css";

interface Props {
  onSubmit: (query: string) => void;
}

function Form({ onSubmit }: Props) {
  const [query, setQuery] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) {
      toast.error("Enter search query!");
      return;
    }
    onSubmit(query);
    setQuery("");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  console.log("Form: рендериться");
  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <input className={style.input} placeholder="What do you want to write?" name="search" autoFocus value={query} onChange={handleInputChange} />

      <button className={style.button} type="submit">
        <FiSearch size="16px" />
      </button>
    </form>
  );
}

export default memo(Form);
