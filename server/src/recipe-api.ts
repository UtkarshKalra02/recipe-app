import "dotenv/config"

const apiKey = process.env.API_KEY;

export const searchRecipes = async (searchTerm: string, page:number ) => {
    if(!apiKey){
        throw new Error("API Key not Found")
    }

    const url = new URL("https://api.spoonacular.com/recipes/complexSearch");

    const queryParams = {
        apiKey,
        query: searchTerm,
        number: "10",
        offset: (page * 10).toString() //Skip first 10 results
    }
    url.search = new URLSearchParams(queryParams).toString()

    try{
        const searchResponse = await fetch(url);
        const resultsJson = await searchResponse.json();
        return resultsJson;
    }catch(error){
        console.log(error);
    }
};

export const getRecipeSummary = async (recipeId:string) => {
    if(!apiKey){
        throw new Error("API Key not Found")
    }
    const url = new URL(`https://api.spoonacular.com/recipes/${recipeId}/summary`);
    const queryParams = {
        apiKey: apiKey
    };

    url.search = new URLSearchParams(queryParams).toString();
    
    const response = await fetch(url)
    const json = await response.json();

    return json;
}

