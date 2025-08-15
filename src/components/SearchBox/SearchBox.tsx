// React imports
import React, { memo } from "react";

// Styles
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onSearch: (value: string) => void;
}

function SearchBox({ value, onSearch }: SearchBoxProps) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    onSearch(newValue);
  };

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search posts"
      onChange={handleInputChange}
      value={value}
    />
  );
}

export default memo(SearchBox);
