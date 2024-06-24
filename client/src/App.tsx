import { FormEvent, useRef, useState } from 'react';
import "./App.css"
import * as api from './api.ts'
import { Recipe } from './types.ts';
import RecipeCard from './components/RecipeCard.tsx';
import RecipeModal from './components/RecipeModal.tsx';

const App = () => {
  const [searchTerm, setsearchTerm] = useState<string>("burgers");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setselectedRecipe] = useState<Recipe | undefined>(undefined);
  const pageNumber = useRef(1);

  const handleSearchSubmit = async(event: FormEvent) => {
    event.preventDefault()
    try{
      const recipes = await api.searchRecipes(searchTerm, 1)
      setRecipes(recipes.results);
      pageNumber.current = 1;
    }catch(e){
      console.log(e);
      
    }
  }

  const handleViewMore = async () => {
    const nextPage = pageNumber.current + 1;
    try{
      const nextRecipes = await api.searchRecipes(searchTerm, nextPage)
      setRecipes([...recipes, ...nextRecipes.results])
      pageNumber.current = nextPage;
    }catch(error){
      console.log(error);
      
    }
  }

  return (
    <div>
      <form onSubmit={(event) => handleSearchSubmit(event)}>
        <input 
        type='text' 
        value={searchTerm} 
        onChange={(event) => setsearchTerm(event.target.value)} 
        required />
      <button type='submit'>Submit</button>
      </form>
      {recipes.map((recipe) => (
        <RecipeCard recipe={recipe} onClick={() => setselectedRecipe(recipe)} />
      ))}
      <button className='view-more-button'
      onClick={handleViewMore}>View More</button>

      {selectedRecipe ? (<RecipeModal recipeId={selectedRecipe.id.toString()} 
      onClose = {() => setselectedRecipe(undefined)}/>): null}

    </div>
  )
}

export default App