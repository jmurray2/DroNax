import { Component, ViewChild, ElementRef, Injectable, NgZone } from '@angular/core';
import { AppService } from "../../app/app.service";
import { ActionSheetController } from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from "ionic-angular";
declare var google;
@Component({
    selector: 'add-address-ionic',
    templateUrl: 'add-address-page.html',

})

export class AddAddressPage {
  GoogleAutocomplete;
  autocomplete;
  autocompleteItems;
  geocoder;
  map;
  markers = [];
  marker;
  show: boolean = true;
  markerPos;
  constructor(public navCtrl: NavController,private alertCtrl: AlertController,public actionSheetCtrl: ActionSheetController,public service: AppService,private zone: NgZone){
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.geocoder = new google.maps.Geocoder();
    console.log(this.service.user.addresses);
  }

  ionViewDidEnter(){
    //Set latitude and longitude of some place
    /*this.geolocation.getCurrentPosition().then((resp) => {
      let pos = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };*/
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.9011, lng: -56.1645 },
        zoom: 15
      });

    }
    updateSearchResults(){
      if (this.autocomplete.input == '') {
        this.autocompleteItems = [];
        return;
      }
      this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          if(predictions != null) {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        }
        });
      });
    }
    selectSearchResult(item){
      //this.clearMarkers();
      this.autocompleteItems = [];
      if(this.markers.length != 0 )
      {
        this.markers[0].setMap(null);
        this.markers = [];
      }
      this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
        if(status === 'OK' && results[0]){
          let position = {
              lat: results[0].geometry.location.lat,
              lng: results[0].geometry.location.lng
          };
          var marker = new google.maps.Marker({
            position: results[0].geometry.location,
            map: this.map,
            draggable: true
          });
          console.log(results);
          this.markers.push(marker);
          this.map.setCenter(results[0].geometry.location);
          /*google.maps.event.addListener(marker, 'dragend', function(ev){
            this.markerPos = marker.getPosition(); // new LatLng-Object after dragend-event...
            console.log(this.markerPos);
            //console.log(marker.getPostion());
            //this.markerPos = marker.getPosition();
          });*/
          google.maps.event.addListener(marker, 'dragend', () => {
            this.markerPos = marker.getPosition();
            console.log(this.markerPos);
          });
          let actionSheet = this.actionSheetCtrl.create({
          title: "Do you want to add " + results[0].formatted_address,
          buttons: [
            {
              text: 'Yes',
              role: 'destructive',
              handler: () => {
                this.service.addAddress(results[0].formatted_address, results[0].geometry.location);
                console.log('Save Address');
                for(let address of this.service.user.addresses)
                {
                  console.log(address);
                }
              }
            },
            {
              text: 'No',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            }
          ]
        });
     
        actionSheet.present();
         
         
        }
      })
    }

    setAddress(){
      console.log(this.markerPos);
      this.map.setCenter(this.markerPos);
      this.map.setZoom(18);
      let actionSheet = this.actionSheetCtrl.create({
        title: "Do you want to add this address to default?",
        buttons: [
          {
            text: 'Yes',
            role: 'destructive',
            handler: () => {
              this.setAddressName();
            }
          },
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    }

    setAddressName()
    {
      
      let alert = this.alertCtrl.create({
        title: 'Default Address Name',
        inputs: [
          {
            name: 'address',
            placeholder: 'Address Name'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Add',
            handler: data => {
              console.log(data.address);
              this.service.addAddress(data.address , this.markerPos);
              this.navCtrl.pop();
            }
          }
        ]
      });
      alert.present();
              
    }
}