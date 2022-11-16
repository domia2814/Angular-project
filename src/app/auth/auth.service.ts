import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, Subject, throwError } from "rxjs"
import { User } from "./user.model";
import { Router } from "@angular/router";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean
}


@Injectable({providedIn: 'root'}) // alternatywą do providedIn... byłoby dodanie servisu do app.module do providers
export class AuthService {
    user = new BehaviorSubject<User>(null)
    private tokenExpirationTimer: any

    constructor(private http: HttpClient, private router: Router){}

    signup(email: string, password: string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC2YhZqvOjFUR3N8hTW6ZE7Q7Od8DMtH1M', // metoda post oraz link wzięty z firebase: https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
    // AIzaSyC2YhZqvOjFUR3N8hTW6ZE7Q7Od8DMtH1M - wzięte z firebase - project overview - project settings- web API key
    {
        email: email,
        password: password,
        returnSecureToken: true // te wartości rownież są wzięte z Firebase API
    }
    ).pipe(
        catchError(this.handleError), 
        tap(resData => {
            this.handleAuthentication(
                resData.email, 
                resData.localId, 
                resData.idToken, 
                +resData.expiresIn 
                )
        })  
        )   
    }   

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC2YhZqvOjFUR3N8hTW6ZE7Q7Od8DMtH1M',
        {
            email: email,
            password: password,
            returnSecureToken: true // te wartości rownież są wzięte z Firebase API
        }
        ).pipe(
            catchError(this.handleError),
            tap(resData => {
                this.handleAuthentication(
                    resData.email, 
                    resData.localId, 
                    resData.idToken, 
                    +resData.expiresIn 
                    )
            })  
            )
    }

    autoLogin(){
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'))
        if (!userData) {
            return
        }

        const loadedUser = new User(
            userData.email, 
            userData.id, 
            userData._token, 
            new Date(userData._tokenExpirationDate)
            )
        if(loadedUser.token) {
            this.user.next(loadedUser)
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - 
            new Date().getTime() 
            this.autoLogout(expirationDuration)
        }
    }

    logout() {
        this.user.next(null)
        this.router.navigate(['/auth'])
        localStorage.removeItem('userData')
        if (this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer)
        }
        this.tokenExpirationTimer = null
    }

    autoLogout(expirationDuration: number) {
        console.log(expirationDuration)
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout()
        }, expirationDuration )
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number){
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
        const user = new User(
            email, 
            userId, 
            token,
            expirationDate
            )
        this.user.next(user)
        this.autoLogout(expiresIn * 1000)
        localStorage.setItem('userData', JSON.stringify(user))
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = "An unknown error occurred!"
        if (!errorRes.error || !errorRes.error.error ) {
            return throwError(errorMessage)
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage ='This email exists already!'
                break
            case 'EMAIL_NOT_FOUND':
            errorMessage ='This email does not exists!'
                break
            case 'INVALID_PASSWORD':
                errorMessage ='This password is not correct'
                break
        }
        return throwError(errorMessage)
    }

}