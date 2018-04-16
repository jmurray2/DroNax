import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { MainMenu } from "../main-menu/main-menu"
import { AlertController } from "ionic-angular";
import { CreateAccountPage } from "../create-account-page/create-account-page"
//import { UserPage } from "../user-page/user-page"
import { HttpClient } from "@angular/common/http";
import { Events } from "ionic-angular";
import { AppService } from "../../app/app.service";

@Component({
  selector: "login-page-ionic",
  templateUrl: "login-page.html"
})
export class LoginPage {

    constructor(public service: AppService,private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private events: Events, private http: HttpClient) {
    }

	public signIn(username, password) 
	{
		let res = this.service.signIn(username,password);
		console.log(res);
		if(res)
		{
			this.navCtrl.setRoot(MainMenu);
		}
		else
		{
			let alert = this.alertCtrl.create({
                message: "Login was incorrect!",
                buttons:[ {
                        text: "Ok",
                        role: "cancel"
                      }]
                });
                alert.present();
		}
	}

	public createAccount()
	{
		this.navCtrl.push(CreateAccountPage);
	}
	
	public runIntegrationTests()
	{
		console.log("Starting Tests...");
		
		const that = this;
		const username = "testUsername";
		const email = "test@email.com";
		const password = "test";
		const data = {"Username": username, "Email": email, "Password":password};
		
		function test(testName, data, wantToPass) {
			console.log("Running " + testName);
			let failMessage = "Failed ";
			let passMessage = "Passed ";
			if(!wantToPass) {
				failMessage = "Passed ";
				passMessage = "Failed ";
			}
			// This block gets a status update from testName()
			let state = 0;
			that.events.subscribe(testName + ":status", eventData => {
				state = eventData == "success" ? 1 : -1
			})
			that.events.publish(testName, data);
			
			// If the test takes more than 5 seconds, it times out. (This isn't working for some reason)
			setTimeout(function() {
				if(state == 0) {
					state = -2;
				}
			}, 2000);
			
			// Spin until it times out, or gets the status update. Not sure if this is necessary. Just to be safe.
			while(state == 0) {console.log("Spinning"); break;}
			
			// Check test results
			switch(state) {
				case -2:
					console.log("Timed out!");
					return false
				case -1:
					console.log(failMessage + testName);
					return !wantToPass
				case 1:
					console.log(passMessage + testName);
					return wantToPass
			}
		}
		
		// Example working request
		this.http.get('https://jsonplaceholder.typicode.com/posts/1')
		.subscribe(data => {
			console.log(data);
		});
		
		// The deleteAccount tests don't work unless you manually visit the User Page before running it...
		// I haven't figured out an elegant work around yet.
		
		// This doesn't work...
		// this.navCtrl.setRoot(UserPage); // To call constructor
		
		// Comment out any tests you don't want to run.
		
		// First test tries to delete an account which shouldn't exist. This should cause an error
		//if(!test("deleteAccount", data, false)) {return}
		
		// Now try to log in with the account which shouldn't exist.
		// if(!test("signIn", data, false)) {return}
		
		// Now create an account with the above user info (username, email, password)
		if(!test("createAccount", data, true)) {return}
		
		// Attempts to sign in with the newly created account.
		if(!test("signIn", data, true)) {return}
		
		// Delete the account just created
		// if(!test("deleteAccount", data, true)) {return}
	}
}