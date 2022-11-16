import { Component, OnDestroy, OnInit} from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
    collapsed = true
    // @Output() featureSelected = new EventEmitter<string>();

    // onSelect(feature: string){
    //     this.featureSelected.emit(feature)
    // }

    isAuthenticated = false
    private userSub: Subscription

    constructor(
        private dataStoragrService: DataStorageService, 
        private authService: AuthService) {}

    ngOnInit(): void {
        this.userSub = this.authService.user.subscribe(user => {
            this.isAuthenticated = !!user // tzn !user ? false : true   
        })
    }

    onSaveData(){
        this.dataStoragrService.storeRecipes()
    }

    onFetchData(){
        this.dataStoragrService.fetchRecipes().subscribe()
    }

    onLogout(){
        this.authService.logout()
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe()
    }
}