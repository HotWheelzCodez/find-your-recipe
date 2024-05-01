import "./MealComponet.css";
import { Meal } from "../types/Meal";

interface MealComponetProps {
  meal: Meal;
}

const MealComponet: React.FC<MealComponetProps> = ({ meal }) => {
  const validIngredients: string[] = meal.listedIngredients.filter(ingredient => ingredient != '' && ingredient != null);
  const ingredientsText = validIngredients.join(', ');

  return (
    <div className="meal-container">
      <h1 className="meal-name">{meal.name}</h1>
      <img className="image" src={meal.imagePath} alt={meal.name}/>
      <h2 className="time-to-cook"><b>Time to cook: </b><i>{meal.cookTime} minutes</i></h2>
      <div className="ingredients-container">
        <h2>Ingredients: </h2>
        <p className="p-ingredient">{ingredientsText}</p>
      </div>
      <p className="instructions">{meal.instructions}</p>
    </div>
  )
}

export default MealComponet;
