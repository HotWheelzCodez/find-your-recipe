import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Meal } from "../types/Meal.tsx";
import "./MainApp.css";

const MainApp = () => {
  const [ingredients, setIngredients] = useState<string[]>([]); 
  const [input, setInput] = useState<string>("");
  const [filtered, setFiltered] = useState<string[]>([]);
  const [items, setItems] = useState<string[]>(() => {
    const storedItems: string = window.localStorage.getItem("items") || "";
    return storedItems != "" ? storedItems.split(" ") : [];
  });
  const [style, setStyle] = useState<string>(() => {
    const storedStyle: string = window.localStorage.getItem("style") || "";
    return storedStyle != "" ? storedStyle : "Italian";
  });
  const [time, setTime] = useState<number>(() => {
    const storedTime: string = window.localStorage.getItem("time") || "";
    return storedTime != "" ? +storedTime : 30;
  });
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

    setInput("");
  }

  const deleteItem = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const toDelete: string = event.currentTarget.getAttribute("data-value") || "";

    if (items.includes(toDelete) && window.confirm("Do you want to delete this item?")) {
      setItems(currentItems => currentItems.filter((item) => item != toDelete));
    }
  }

  const handleBlur = () => {
    setTimeout(() => {
      setFocused(false);
    }, 200);
  }

  const handleStyleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setStyle(event.currentTarget.value);
  }

  const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setTime(+event.currentTarget.value);
  }

  const getCookTime = (instructions: string) => {
    let cookTime: number = 0;
    const words: string[] = instructions.split(" ");
    const timeKeywords: Set<string> = new Set(["minute", "minutes", "min", "mins", "hour", "hours"]);

    for (let i = 0; i < words.length; i++) {
      const word = words[i].replace(/[^a-z]/gi, '').toLowerCase();
      if (timeKeywords.has(word)) {
        const prevWord: string = words[i-1];
        if (prevWord.includes("-")) {
          const range: string[] = prevWord.split("-");
          if (range.length == 2) {
            let avgTime = (parseInt(range[0]) + parseInt(range[1])) / 2;
            cookTime += isNaN(avgTime) ? 0 : avgTime;
          }
        } else {
          let tempTime = parseInt(prevWord);
          if (!isNaN(tempTime)) {
            if (word.includes("hour")) {
              tempTime *= 60;
            }
            cookTime += tempTime;
          }
        }
      } else if (word == "preheat") {
        cookTime += 15;
      } else if (word == "boil") {
        cookTime += 10;
      }
    }

    return (cookTime + 15);
  };

  const getRecipe = async () => {
    window.localStorage.setItem("items", items.join(" "));
    window.localStorage.setItem("style", style);
    window.localStorage.setItem("time", time.toString());

    try {
      const styleApi = "https://www.themealdb.com/api/json/v1/1/filter.php?a="+style;
      await fetch(styleApi)
      .then(response => response.json())
      .then(data => {
        if (data && data.meals) {
          const meals = data.meals as any[];
          const ourMeals: Meal[] = [];
          meals.forEach(meal => {
            const mealApi = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="+meal.idMeal;
            fetch(mealApi)
            .then(mealResponse => mealResponse.json())
            .then(mealData => {
              const name: string = mealData.meals[0].strMeal;
              const instructions: string = mealData.meals[0].strInstructions;
              const imagePath: string = mealData.meals[0].strMealThumb;
              const cookTime: number = getCookTime(instructions);
              const listedIngredients: string[] = [];
              listedIngredients.push(mealData.meals[0].strIngredient1);
              listedIngredients.push(mealData.meals[0].strIngredient2);
              listedIngredients.push(mealData.meals[0].strIngredient3);
              listedIngredients.push(mealData.meals[0].strIngredient4);
              listedIngredients.push(mealData.meals[0].strIngredient5);
              listedIngredients.push(mealData.meals[0].strIngredient6);
              listedIngredients.push(mealData.meals[0].strIngredient6);
              listedIngredients.push(mealData.meals[0].strIngredient8);
              listedIngredients.push(mealData.meals[0].strIngredient9);
              listedIngredients.push(mealData.meals[0].strIngredient10);
              listedIngredients.push(mealData.meals[0].strIngredient11);
              listedIngredients.push(mealData.meals[0].strIngredient12);
              listedIngredients.push(mealData.meals[0].strIngredient13);
              listedIngredients.push(mealData.meals[0].strIngredient14);
              listedIngredients.push(mealData.meals[0].strIngredient15);

              if (cookTime <= time) {
                let rank: number = 0;
                for (let i = 0; i < items.length; i++) {
                  for (let j = 0; j < listedIngredients.length; j++) {
                    if (listedIngredients[j].toLowerCase().includes(items[i])) {
                      rank++;
                      break;
                    }
                  } 
                }
                const meal: Meal = { name, imagePath, instructions, listedIngredients, cookTime, rank };
                ourMeals.push(meal);
                window.localStorage.setItem("meals", JSON.stringify(ourMeals));
              }
            });
          });
        }
      })
    .catch(error => console.log("Could not load meal style!", error));
    } catch (error) {
      console.log("Failed to load recipes!", error);
    }
  }

  return (
    <div className="main-app">
      <h1>Set it up your way!</h1>
      <div className="input-area">
        <div className="input-selection">
          <label className="input-name">Food Types:</label>
          <select className="drop-down" onChange={handleStyleChange} value={style}>
            <option value="Italian">Italian</option>
            <option value="Mexican">Mexican</option>
            <option value="American">American</option>
            <option value="French">French</option>
            <option value="Chinese">Chinese</option>
            <option value="Indian">Indian</option>
          </select>
        </div>
        <div className="input-selection">
          <label className="input-name">Time to Cook:</label>
          <select className="drop-down" onChange={handleTimeChange} value={time}>
            <option value="30">30 minutes</option>
            <option value="60">60 minutes</option>
            <option value="90">90 minutes</option>
            <option value="120">120 minutes</option>
            <option value="150">150 minutes</option>
            <option value="180">180 minutes</option>
            <option value="240">240+ minutes</option>
          </select>
        </div>
        <div className="input-selection" id="ingredients-input">
          <div className="top">
            <label className="input-name">Ingridents:</label> 
            <input value={input}
            onChange={handleInput} 
            onFocus={() => setFocused(true)}
            onBlur={handleBlur}
            className="input"
            />
          </div>
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
        <Link to="/recipe">
          <button className="submit" onClick={getRecipe}>Find Your Recipe</button>
        </Link>
      </div>
    </div>
  );
}

export default MainApp;
