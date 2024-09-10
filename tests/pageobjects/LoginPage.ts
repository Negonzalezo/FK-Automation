import { expect, Locator, Page } from "@playwright/test"

export class LoginPage{

    private readonly usernameTextbox: Locator 
    private readonly passwordTextbox: Locator 
    private readonly loginButton: Locator
    private readonly appLogin: Locator

    constructor(page: Page){
        this.usernameTextbox = page.getByRole('textbox', {name: 'Username'})
        this.passwordTextbox = page.getByRole('textbox', {name: 'Password'})
        this.loginButton = page.getByRole('button' , {name: 'Login'})
        this.appLogin = page.locator('.app_logo')
    }

    async fillUsername(username: string){
        await this.usernameTextbox.fill(username)
    }
    async fillPassword(password: string){
        await this.passwordTextbox.fill(password)
    }
    async clickOnLogin(){
        await this.loginButton.click() 
    }

    async CredentialsEntry(username:string, password:string){
        await this.fillUsername(username)
        await this.fillPassword(password)
        await this.clickOnLogin()      
    }

    async loginSuccessful(){
        await expect(this.appLogin).toBeVisible
        console.log(`Login: ¡ Login Successful !`)
    }
}