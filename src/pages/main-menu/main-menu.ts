import { Component } from '@angular/core';
import { ItemDetailsPage } from '../item-details/item-details';
import { NavController, NavParams } from 'ionic-angular';
import { UserPage } from '../user-page/user-page'
import { EmergencyPage } from '../emergency-page/emergency-page'
import { AppService } from "../../app/app.service";

@Component({
  selector: 'main-menu-ionic',
  templateUrl: 'main-menu.html'
})
export class MainMenu {
  actions: Array<{title: string}>;
  constructor(public service: AppService,public navCtrl: NavController, public navParams: NavParams) {
        this.actions = [];
        this.actions.push({title: 'What do I do with an overdose?'});
        this.actions.push({title: 'How long does the drone take?'});
        this.actions.push({title: 'How do I administer Naloxone?'});
        this.actions.push({title: 'Where is the nearest rehab center?'});
        this.actions.push({title: 'How do I pay for the medication'});
        this.actions.push({title: 'How do I update my billing information?'});
  }
  public isPressed(event, action)
  {
    this.navCtrl.push(ItemDetailsPage, {
        item: action    
    });
  }   
  public toUserPage()
  {
    this.navCtrl.push(UserPage);
  }
  public toEmergencyPage()
  {
    this.navCtrl.push(EmergencyPage);
  }
}