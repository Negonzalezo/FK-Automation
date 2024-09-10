import { Actor, Task } from "@testla/screenplay-playwright";
import { Click, Fill, Navigate, Press } from "@testla/screenplay-playwright/web";

export class SauceDemo extends Task {
   
    public async performAs(actor: Actor): Promise<void>{
        return actor.attemptsTo(
            Navigate.to('https://www.saucedemo.com'),            
        );     
    }

    public static search(): SauceDemo{
        return new SauceDemo();
    }    
}