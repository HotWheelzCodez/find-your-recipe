import { useEffect, useState } from "react";
import { Meal } from "../types/Meal.tsx";
import "./Recipe.css";
import MealComponet from "../componets/MealComponet.tsx";

const Recipe = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [viewAmount, setViewAmount] = useState<number>(3);

  useEffect(() => {
    const fetchMeals = (): void => {
      const storedMeals = window.localStorage.getItem("meals");
      if (storedMeals) {
        setMeals(JSON.parse(storedMeals));
      }
    }

    setTimeout(() => {
      fetchMeals();
      setMeals(currentMeals => [...currentMeals].sort((a, b) => b.rank - a.rank).slice(0, 10));
    }, 1000);
  }, []);

  return (
    <div className="main-body">
      <h1>Recipes</h1>
      {meals.length == 0 ? (
        <p>Loading...</p>
      ) : (
        meals.slice(0, viewAmount).map((meal: Meal) => (
          <MealComponet key={meal.name} meal={meal} />
        ))
      )}
      {viewAmount == 3 ? (
        <button className="view-amount" onClick={() => setViewAmount(10)}><i>View More...</i></button>
      ) : (
        <button className="view-amount" onClick={() => setViewAmount(3)}><i>View Less...</i></button>
      )}
    </div>
  );
}

export default Recipe;
