import express from 'express';
import cors from 'cors'
import * as RecipeAPI from './recipe-api';
import "dotenv/config";
import {PrismaClient} from '@prisma/client'
import { error } from 'console';

const app = express();
const prismaClient = new PrismaClient();
app.use(cors());
app.use(express.json());

app.get("/api/recipes/search", async(req, res) => {
    const searchTerm = req.query.searchTerm as string;
    const page = parseInt(req.query.page as string);
    const results = await RecipeAPI.searchRecipes(searchTerm, page);

    return res.json(results);
});

app.post("/api/recipes/favourite", async(req, res) => {
    const recipeId = req.body.recipeId;

    try{
        const favouriteRecipe = await  prismaClient.favouriteRecipes.create({
            data: {
                recipeId: recipeId
            }
        });
        return res.status(201).json(favouriteRecipe)
    }catch(e){
        console.log(e);
        return res.status(500).json({error: "Oops, Something went wrong"})
        

    }
});

app.get("/api/recipes/favourite", async(req, res) => {
    try{
        const recipes = await prismaClient.favouriteRecipes.findMany();
        const recipeIds = recipes.map((recipe) => recipe.recipeId.toString())
        const favourites = await RecipeAPI.getFavouriteRecipesByIDs(recipeIds)

        return res.json(favourites);
    }catch(e){}
});

app.get("/api/recipes/:recipeId/summary", async(req,res) => {
    const recipeId = req.params.recipeId;
    const results = await RecipeAPI.getRecipeSummary(recipeId)
    return res.json(results);
})

app.delete('/api/recipes/favourite', async(req, res) => {
    const recipeId = req.body.recipeId;
    try{
        await prismaClient.favouriteRecipes.deleteMany({
            where: {
                recipeId: recipeId
            }
        });
        return res.status(204).send();
    }catch(e){
        console.log(e);
        return res.status(500).json({error: "Oops, Something went wrong"})
    }
})

app.listen(8080, () => {
    console.log("Server Running on localhost:8080");
});