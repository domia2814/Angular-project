import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http'
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { exhaustMap, map, take, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";

@Injectable({providedIn: 'root'}) //to jest opcjonalny zapis z dodaniem w tablicy providers w app.module!
export class DataStorageService {
    constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) {}

storeRecipes(){
    const recipes = this.recipeService.getRecipe()
    return this.http
    .put('https://ng-course-recipe-book-e5671-default-rtdb.firebaseio.com/recipes.json',  //metoda push dotyczyłaby jednego przepisu, put - wszystkich
    recipes)
    .subscribe(response => {
        console.log(response)
    })
}

fetchRecipes(){
    
 return this.http.get<Recipe[]>(
    'https://ng-course-recipe-book-e5671-default-rtdb.firebaseio.com/recipes.json' 
    ).pipe(
         map(recipes => {   // to map jest z rxjs/operators
            return recipes.map(recipe => {   // to map jest zwykłą metodą tablicową
                return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients: []}
        })
    }),
        tap(recipes => {
            this.recipeService.setRecipes(recipes)  
    })
    )  
 }
}