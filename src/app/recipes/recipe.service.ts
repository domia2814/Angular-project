import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()

export class RecipeService {
    recipesChanged = new Subject<Recipe[]>()

    // private recipes: Recipe[] = [   // to jest nasz własny "przepis", własny typ, został okreslony w recipe.model.ts
    // new Recipe(
    //     'Tasty Schnitzel', 
    //     'A super-tasty Schnitzel - just awesome!', 
    //     'https://staticsmaker.iplsc.com/smaker_prod_2018_07_14/5fe5fcfd4ad0b10f6f16425d5ef21fc8-lg.jpg',
    //     [
    //         new Ingredient('Meat', 1),
    //         new Ingredient('French Fries', 20)
    //     ]) ,
    // new Recipe(
    //     'Big Fat Burger',
    //     'this is a simply test', 
    //     'https://www.unileverfoodsolutions.pl/dam/global-ufs/mcos/nee/poland/recipe/italian-burger/wloski-burger_1611135467.jpg',
    //     [
    //         new Ingredient('Buns', 2),
    //         new Ingredient('Meat', 1)
    //     ])
    // ];

    private recipes: Recipe[] = []

    constructor(private slService: ShoppingListService) {}

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes // this override recipes we got
        this.recipesChanged.next(this.recipes.slice())
    }

    getRecipe(){
        return this.recipes.slice(); //zwraca kopię tablicy takiej samej
    }

    getRecipes(index: number){
        return this.recipes[index]
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]){
        this.slService.addIngredients(ingredients)
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe)
        this.recipesChanged.next(this.recipes.slice())  // ???? nie rozumiem czemu to musi być dodane żeby button submit zadziałał
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe
        this.recipesChanged.next(this.recipes.slice())
    }

    deleteRecipe(index: number){
        this.recipes.splice(index, 1)
        this.recipesChanged.next(this.recipes.slice())
    }
}