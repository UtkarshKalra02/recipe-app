import { FormEvent, useEffect, useRef, useState } from 'react';
import "./App.css"
import * as api from './api.ts'
import { Recipe } from './types.ts';
import RecipeCard from './components/RecipeCard.tsx';
import RecipeModal from './components/RecipeModal.tsx';

type Tabs = "search" | "favourites"

const App = () => {
  const [searchTerm, setsearchTerm] = useState<string>("burgers");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setselectedRecipe] = useState<Recipe | undefined>(undefined);

  const [selectedTab, setselectedTab] = useState<Tabs>("search")
  const [favouriteRecipes, setfavouriteRecipes] = useState<Recipe[]>([])
  const pageNumber = useRef(1);

  useEffect(() => {
    const fetchFavouriteRecipes = async () => {
      try {
        const favouriteRecipes = await api.getFavouriteRecipes();
        setfavouriteRecipes(favouriteRecipes.results);
        
      } catch (e) {
        console.log(e);

      }
    }
    fetchFavouriteRecipes();
  }, [])

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      const recipes = await api.searchRecipes(searchTerm, 1)
      setRecipes(recipes.results);
      pageNumber.current = 1;
    } catch (e) {
      console.log(e);

    }
  }

  const handleViewMore = async () => {
    const nextPage = pageNumber.current + 1;
    try {
      const nextRecipes = await api.searchRecipes(searchTerm, nextPage)
      setRecipes([...recipes, ...nextRecipes.results])
      pageNumber.current = nextPage;
    } catch (error) {
      console.log(error);

    }
  };

  const addFavouriteRecipe = async (recipe: Recipe) => {
    try {
      await api.addFavouriteRecipe(recipe)
      setfavouriteRecipes([...favouriteRecipes, recipe])
    } catch (error) {
      console.log(error);
    }
  };

  const removeFavouriteRecipe = async (recipe: Recipe) => {
    try {
        await api.removeFavouriteRecipe(recipe);
        const updatedRecipes = favouriteRecipes.filter(
          (favRecipe) => recipe.id !== favRecipe.id);
          setfavouriteRecipes(updatedRecipes)
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <div>
      <div className='tabs'>
        <h1 onClick={() => setselectedTab("search")}>Recipe Search</h1>
        <h1 onClick={() => setselectedTab("favourites")}>Favourites</h1>
      </div>
      {selectedTab == "search" && (<>
        <form onSubmit={(event) => handleSearchSubmit(event)}>
          <input
            type='text'
            value={searchTerm}
            onChange={(event) => setsearchTerm(event.target.value)}
            required />
          <button type='submit'>Submit</button>
        </form>
        {recipes.map((recipe) => {
              const isFavourite = favouriteRecipes.some(
                (favRecipe) => recipe.id === favRecipe.id
              );

              return (
                <RecipeCard
                  recipe={recipe}
                  onClick={() => setselectedRecipe(recipe)}
                  onFavouriteButtonClick={
                    isFavourite ? removeFavouriteRecipe : addFavouriteRecipe
                  }
                  isFavourite={isFavourite}/>
        );
})}
        <button className='view-more-button'
          onClick={handleViewMore}>View More</button>

      </>)}

      {selectedTab === "favourites" && (
        <div>
          {favouriteRecipes.map((recipe) => (
            <RecipeCard recipe={recipe} onClick={() => setselectedRecipe(recipe)}
            onFavouriteButtonClick = {removeFavouriteRecipe} 
            isFavourite={true}/>
          ))}
        </div>
      )}

      {selectedRecipe ? (<RecipeModal recipeId={selectedRecipe.id.toString()}
        onClose={() => setselectedRecipe(undefined)} />) : null}

    </div>
  )
}

export default App