import { Link } from "react-router-dom";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.css'; 
import recipe from "./assets/recipe.jpeg";
import recipe1 from "./assets/recipe1.jpeg";
import recipe2 from "./assets/recipe2.jpeg";
import Carousel from 'react-bootstrap/Carousel';

const App = () => {
  const images = [
    recipe,
    recipe1,
    recipe2
  ];

  return (
    <div className="app">
      <div className="carousel-container">
        <Carousel slide={true} interval={2000} indicators={false} className="carousel">
          {images.map((image, idx) => (
            <Carousel.Item key={idx}>
              <img src={image} className="carousel-image" key={idx}/>
            </Carousel.Item>
          ))}
        </Carousel>
        <div className="hero-container">
          <div className="title">
            <h1>Welcome To</h1>
            <h1>Find Your Recipe</h1>
          </div>
          <p id="info">Recipes for you, with what you have, for the time you have.</p>
          <div className="buttons" id="buttons-first">
            <Link to="/app">
              <button id="to-app-first" className="link-button">Get Started</button>
            </Link> 
          </div>
        </div>
      </div>
      <section id="about-project">
        <div className="about-project-container">
          <div className="about-project-title">
            <h1>About</h1>
            <h1>Find Your Recipe</h1>
          </div>
          <p id="about-project-info">
            This project is for a Tradeshow assignment for my school, we must find a problem,
            proove that it is a problem, and then create a soultion, this is my soultion to my
            problem, and a problem for many others. The problem is that many people such as parents or 
            college students don't have a lot of time to cook nor the energy to slave over the stove for hours; 
            thus the soultion to it make an app that allows you to use the ingridents you currently
            have, and input the time you have, or the time you want to spend to cook and then
            the type of food you like and then be provided with recipes that suites YOUR wants.
          </p>
          <div className="buttons" id="buttons-second">
            <Link to="/app">
              <button id="to-app-second" className="link-button">Find Your Recipe</button>
            </Link> 
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
