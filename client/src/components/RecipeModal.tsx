import { useEffect, useState } from "react"
import { RecipeSummary } from "../types"
import * as RecipeAPI from '../api.ts'

interface Props{
  recipeId: string
  onClose: ()=> void;
}

const RecipeModal = ({recipeId, onClose}: Props) => {
  const [recipeSummary, setrecipeSummary] = useState<RecipeSummary>();

  useEffect(()=> {
    const fetchRecipeSummary = async () => {
      try{
        const summaryRecipe = await RecipeAPI.getRecipeSummary(recipeId);
        setrecipeSummary(summaryRecipe);
      }catch(e){
        console.log(e);
      }
    };
    fetchRecipeSummary();
  }, [recipeId])

  if(!recipeSummary){
    return <></>;
  }
  return (
    <>
        <div className="overlay"></div>
        <div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{recipeSummary.title}</h2>
                    <span className="close-btn" onClick={onClose}>&times;</span>
                </div>
                <p dangerouslySetInnerHTML={{__html: recipeSummary.summary}}></p>
            </div>
        </div>
    </>
  )
}

export default RecipeModal