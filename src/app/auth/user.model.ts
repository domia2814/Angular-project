export class User {
    constructor(
        public email: string, 
        public id: string, 
        private _token: string, 
        private _tokenExpirationDate: Date
        ) {}

get token() {
    if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate){
        return null
    }
    return this._token
}  // getter it's a property where you can write code that runs when you try to access this property

}