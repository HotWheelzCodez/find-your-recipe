import { useEffect, useState } from "react";
import "./MainApp.css";

const MainApp = () => {
  const [ingredients, setIngredients] = useState<string[]>([]); 
  const [input, setInput] = useState<string>("");
  const [filtered, setFiltered] = useState<string[]>([]);
  const [items, setItems] = useState<string[]>([]);
  const [focused, setFocused] = useState<boolean>(false);

  useEffect(() => {
    fetch("/ingredients.txt")
    .then(response => response.text())
    .then(text => {
      const lines: string[] = text.split("\n");
      setIngredients(lines);
    })
    .catch(error => console.log("Could not load ingridents!", error));
  }, []);

  useEffect(() => {
    if (input && focused) {
      const filter: string[] = ingredients.filter(ingredients => ingredients.toLowerCase().includes(input.toLowerCase())).slice(0, 10);
      setFiltered(filter);
    } else {
      setFiltered([]);
    }
  }, [input, ingredients, focused]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInput(event.target.value);
  }

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const toAdd: string = event.currentTarget.getAttribute("data-value") || "";

    if (toAdd && !items.includes(toAdd)) {
      setItems(currentItems => [...currentItems, toAdd]);
    }
  }

  const deleteItem = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const toDelete: string = event.currentTarget.getAttribute("data-value") || "";

    if (items.includes(toDelete) && window.confirm("Do you want to delete this item?")) {
      setItems(currentItems => currentItems.filter((item) => item !== toDelete));
    }
  }

  const handleBlur = () => {
    setTimeout(() => {
      setFocused(false);
    }, 200);
  }

  return (
    <div className="main-app">
      <h1>Set it up your way!</h1>
      <div className="input-area">
        <div className="input-selection">
          <label className="input-name">Food Types:</label>
          <select className="drop-down">
            <option>Italian</option>
            <option>Mexican</option>
            <option>American</option>
            <option>French</option>
            <option>Chinese</option>
            <option>Indian</option>
          </select>
        </div>
        <div className="input-selection">
          <label className="input-name">Time to Cook:</label>
          <select className="drop-down">
            <option>30 minutes</option>
            <option>1 hour</option>
            <option>1 hour 30 minutes</option>
            <option>2 hours</option>
            <option>2 hours 30 minutes</option>
            <option>3 hours</option>
            <option>4+ hours</option>
          </select>
        </div>
        <div className="input-selection">
          <label className="input-name">Your ingridents:</label> 
          <input value={input}
            onChange={handleInput} 
            onFocus={() => setFocused(true)}
            onBlur={handleBlur}
            className="input"
          />
          <p>or</p>
          <button className="add-ingredient" id="add-image">Image</button>
        </div>
        <div className="display-ingredients">
          {filtered.map((item: string, index: number) => {
            return (
              <button data-value={item}
                onClick={handleAdd}
                className="ingredient"
                key={index}>{item}</button>
            );
          })}
        </div>
        <p>*click to delete item(s)*</p>
        <div className="display-items">
          {items.map((item: string, index: number) => {
            return (
              <button data-value={item}
                key={index}
                onClick={deleteItem} 
                className="selected-ingredient">{item}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MainApp;
