import { useState } from "react";
import { cuisines } from "../data/filterOptions.js";
import "./FilterBar.css";

export default function FilterBar({ value, onChange, resultCount }) {
  const [open, setOpen] = useState(false);
  const update = (patch) => onChange({ ...value, ...patch });

  return (
    <aside className="filterbar">
      <div className="filterbar-head">
        <h3>Filters</h3>
        <button className="filter-clear" onClick={() => onChange({})}>Clear all</button>
      </div>
      <button className="filter-toggle show-mobile" onClick={() => setOpen((o) => !o)}>
        {open ? "Hide filters" : `Show filters (${resultCount})`}
      </button>
      <div className={`filterbar-body ${open ? "open" : ""}`}>
        <fieldset className="filter-group">
          <legend>Rating</legend>
          {[{v:4.5,l:"4.5 & above"},{v:4.0,l:"4.0 & above"},{v:3.5,l:"3.5 & above"}].map((o) => (
            <label key={o.v} className="filter-opt">
              <input type="radio" name="rating" checked={value.minRating === o.v} onChange={() => update({ minRating: o.v })} />
              <span>{o.l}</span>
            </label>
          ))}
        </fieldset>
        <fieldset className="filter-group">
          <legend>Cost for two</legend>
          {[{v:1,l:"$ — Cheap"},{v:2,l:"$$ — Moderate"},{v:3,l:"$$$ — Premium"}].map((o) => (
            <label key={o.v} className="filter-opt">
              <input type="radio" name="cost" checked={value.maxPrice === o.v} onChange={() => update({ maxPrice: o.v })} />
              <span>{o.l}</span>
            </label>
          ))}
        </fieldset>
        <fieldset className="filter-group">
          <legend>Cuisine</legend>
          <div className="filter-chips">
            {cuisines.map((c) => (
              <button key={c} className={`chip ${value.cuisine === c ? "active" : ""}`} onClick={() => update({ cuisine: value.cuisine === c ? undefined : c })}>{c}</button>
            ))}
          </div>
        </fieldset>
        <fieldset className="filter-group">
          <legend>Max delivery time</legend>
          <select value={value.maxTime || ""} onChange={(e) => update({ maxTime: e.target.value ? Number(e.target.value) : undefined })}>
            <option value="">Any time</option>
            <option value="20">Under 20 min</option>
            <option value="30">Under 30 min</option>
            <option value="40">Under 40 min</option>
          </select>
        </fieldset>
      </div>
    </aside>
  );
}
