import { Component } from '@angular/core';
import { NavController, NavParams,ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { LoginPage } from '../login-page/login-page';
import { HttpClient } from "@angular/common/http";
import { Events } from 'ionic-angular';
import { AddAddressPage } from '../add-address-page/add-address-page';
import { AppService } from "../../app/app.service";

declare var google;

@Component({
  selector: 'user-page-ionic',
  templateUrl: 'user-page.html'
})
export class UserPage{
    addresses: string[] = [];
    user: {firstName:string , lastName:string , addresses: Array<string> , billingInfo: string };
    GoogleAutocomplete;
    constructor(public service: AppService,private modalCtrl: ModalController,private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private events: Events, private http: HttpClient) {
        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
        //this.user = this.service.user;
        console.log("Subbed");
        //this.addresses = this.service.addresses;
		/*events.subscribe("deleteAccount", eventData => {
			console.log("hmm")
			this.deleteAccount(true);
        });
        */

    }

    public addAddress()
    {
        /*
        let alert = this.alertCtrl.create({
            title: 'Add Address',
            inputs: [
                {
                    name: 'Address',
                    placeholder: 'Enter Address'
                }
            ],
            buttons: [
                {
                    text: 'Save',
                    handler: data => {
                        this.user.addresses.push(data.Street + " " + data.City + " " + data.State + " " + data.Zip);
						// this.http.put("/user", {}) // The user.put is definitely not in its final version. I don't know what structure it will end up taking.
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        });
        
        alert.present();
        */
       //let profileModal = this.modalCtrl.create(AddAddressPage, { userId: 8675309 });
       //profileModal.present();
       this.navCtrl.push(AddAddressPage);
    }


    public signOut()
    {
        let alert = this.alertCtrl.create({
            message: "Are you sure you want to sign out?",
            buttons: [
                {
                    text: 'Yes',
                    handler: data => {
                        let res = this.service.signOut();
                        if(res)
                        {
                            this.navCtrl.setRoot(LoginPage)
                        }
                    }
                },
                {
                    text: 'No',
                    role: 'cancel'
                }
            ]
        });
        alert.present();
    }

    public deleteAccount(force=false) // Force just deletes the account without a button. Used for testing.
    {
		const that = this;
        console.log("WTF");
        let alert = this.alertCtrl.create({
            message: "Are you sure you want to delete your account? You will no longer be able to sign in.",
            buttons: [
                {
                    text: 'Yes',
                    handler: data => {
                        let res = this.service.deleteAccount();
                        if(res)
                        {
                            this.navCtrl.setRoot(LoginPage)
                        }
                        else
                        {

                        }
                    }
                },
                {
                    text: 'No',
                    role: 'cancel'
                }
            ]
        });
        alert.present();
        
		/*function deleteAction()
		{
			//http.delete("/user", {}) // This is blue in a bad way. Also the server.py isn't deleting enough from the database.
			that.events.publish("deleteAccount:status", "failure")
        }
        */
		
		/*if(force) 
		{
			deleteAction()
		}
		else 
		{
			let alert = this.alertCtrl.create({
				message: "Are you sure you want to delete your account? You will no longer be able to sign in.",
				buttons: [
					{
						text: 'Yes',
						handler: data => {
							deleteAction()
							this.navCtrl.setRoot(LoginPage)
						}
					},
					{
						text: 'No',
						role: 'cancel'
					}
				]
			});
			alert.present();
		}*/
    }
    
}
