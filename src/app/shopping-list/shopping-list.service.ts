import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";

export class ShoppingListService {
    ingredientsChanged = new Subject<Ingredient[]>() // to zabieg aby pojawiały się składniki w tablicy "kopii"
    startedEditing = new Subject<number>()
    private ingredients: Ingredient[] = [
        new Ingredient('apples', 5),
        new Ingredient('tomatoes', 10),
      ];

    getIngredient(){
        return this.ingredients.slice(); // to jest tablica "kopia"
    } 

    getIngredients(index: number){
        return this.ingredients[index]
    }

    addIngredient(ingredient: Ingredient){
        this.ingredients.push(ingredient)
        this.ingredientsChanged.next(this.ingredients.slice()) // to zabieg aby pojawiały się składniki w tablicy "kopii"
    }

    addIngredients(ingredients: Ingredient[]) {
        // for (let ingredient of ingredients) {
        //     this.addIngredient(ingredient)  -- inny sposób
        // }
        this.ingredients.push(...ingredients)
        this.ingredientsChanged.next(this.ingredients.slice())
    }

    updateIngredient(index: number, newIngredient: Ingredient) {
        this.ingredients[index] = newIngredient
        this.ingredientsChanged.next(this.ingredients.slice())
    }

    deleteIngredient(index: number){
        this.ingredients.splice(index, 1)
        this.ingredientsChanged.next(this.ingredients.slice())
    }

}