import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthModel } from "./auth-model";


@Injectable({providedIn: "root"})


export class AuthService{


    private token: string;

    private authenticatedSub = new Subject<boolean>();


    private isAuthenticated = false;
    private isloginorsignup = false;

    private logoutTimer: any;
    getisAuthenticated() {
        return this.isAuthenticated;
    }
    getisisloginorsignup() {
        return this.isloginorsignup;
    }
    getAuthenticatedSub() {
        return this.authenticatedSub.asObservable();
    }
    getToken() {
        return this.token;
    }
    constructor(private http: HttpClient, private router: Router) {}
    signupUser(username: string, password: string) {
        this.isloginorsignup = true;

        
        const authData: AuthModel = {username: username, password: password};
        this.http.post('http://localhost:3000/sign-up/', authData).subscribe(res=> {
            this.loginUser(username,password);
        })
    }


    loginUser(username: string, password: string){
        this.isloginorsignup = true;

        const authData: AuthModel = {username: username, password: password}; 

        this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/login', authData)
            .subscribe(res => {
                this.token = res.token;
                if(this.token){
                    this.authenticatedSub.next(true);
                    this.isAuthenticated = true;
                    this.router.navigate(['/']);
                    this.logoutTimer = setTimeout(() => {this.logout()}, res.expiresIn * 1000);
                    const now = new Date();
                    const expiresDate = new Date(now.getTime() + (res.expiresIn * 1000));
                    this.storeLoginDetails(this.token, expiresDate);
                }
            })
    }


    logout() {
        this.isloginorsignup = false;
        this.token = '';
        this.isAuthenticated = false;
        this.authenticatedSub.next(false);
        this.router.navigate(['/']);

        clearTimeout(this.logoutTimer);
        this.clearLoginDetails();
    }

    storeLoginDetails(token: string, expirationDate: Date){
        localStorage.setItem('token', token);
        localStorage.setItem('expiresIn', expirationDate.toISOString());
    }

    clearLoginDetails(){
        localStorage.removeItem('token');
        localStorage.removeItem('expiresIn');
    }

    getLocalStorageData(){
        const token = localStorage.getItem('token');
        const expiresIn = localStorage.getItem('expiresIn');

        if(!token || !expiresIn){
            return;
        }
        return {
            'token': token,
            'expiresIn': new Date(expiresIn)
        }
    }
    authenticateFromLocalStorage(){
        const localStorageData = this.getLocalStorageData();
        if(localStorageData){
            const now = new Date();
            const expiresIn = localStorageData.expiresIn.getTime() - now.getTime();

            if(expiresIn > 0){
                this.token = localStorageData.token;
                this.isAuthenticated = true;
                this.authenticatedSub.next(true);
                this.logoutTimer.setTimeout(expiresIn / 1000);
            }
        }
    }

}  