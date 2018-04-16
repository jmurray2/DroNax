import { AlertController } from "ionic-angular";
import { Http ,HttpModule} from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Headers } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Component, ViewChild, ElementRef, Injectable, NgZone} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { LoginPage } from '../login-page/login-page';
import { ActionSheetController } from 'ionic-angular';
import { AppService } from "../../app/app.service";
import { ToastController } from 'ionic-angular';


declare var google;

@Component({
  selector: 'emergency-page-ionic',
  templateUrl: 'emergency-page.html'
})

export class EmergencyPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  films: Observable<any>;
  result = "hey";
  body = {};
  reverse: string;
  forward: string;
  err: string;
  res: string;
  markers = [];
  GoogleAutocomplete;
  autocomplete;
  autocompleteItems;
  geocoder;
  markerPos;
  dist;
  sendDrone: boolean = false;

  constructor(private toastCtrl: ToastController, public service: AppService,public actionSheetCtrl: ActionSheetController,private zone: NgZone,private http: Http,private httpClient: HttpClient,private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private nativeGeocoder: NativeGeocoder, public geolocation: Geolocation) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.geocoder = new google.maps.Geocoder();
  }

  ionViewDidEnter(){
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
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }
 
  selectSearchResult(item){
    this.autocompleteItems = [];
  
    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      if(status === 'OK' && results[0]){
        this.addMarker(results[0].geometry.location, this.map, true,results[0].formatted_address);
        var sel = new google.maps.LatLng(results[0].geometry.location.lat, results[0].geometry.location.lng);
        let selAddr = {
          address: results[0].formatted_address,
          loc: results[0].geometry.location
        };
        this.map.setCenter(results[0].geometry.location);
        this.showAddressConfirm(results[0].formatted_address,selAddr);
      }
    })
  }

  getCurrentLocation(){
    this.clearMarkers();
    this.geolocation.getCurrentPosition().then((resp) => {
      let pos = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      this.addMarker(pos,this.map,true,"current location");
      this.map.setCenter(pos);

      var curr = new google.maps.LatLng(pos.lat, pos.lng);
      let currLoc = {
        address: "Current Location",
        loc: curr
      };
      this.showAddressConfirm("current location" , currLoc);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  addInfoWindow(marker, content){
 
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
   
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
   
  }

  sendToDefault()
  {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Select default address to send drone to.",
      buttons: this.createButtons(),
    });
 
    actionSheet.present();
  }

  createButtons()
  {
    let buttons = [];
    for(let address of this.service.user.addresses)
    {
      let button = {
        text: address.address,

        handler: () => {
          this.map.setCenter(address.loc);
          this.map.setZoom(18);
          this.addMarker(address.loc,this.map,true, address.address);
          //this.confirmDrone(address);
        }
      }
      buttons.push(button);
    }
    let button = {
      text: "Cancel",
      role:"cancel"
    }
    buttons.push(button);
    return buttons;
  }

  public confirmDrone(/*addr*/)
  {
    let url = 'http://10.141.166.89:8000/gui/'

    let alert = this.alertCtrl.create({
      message: "Are you sure you want to send a drone to " + this.markerPos.address + "?",
      buttons: [
        {
          text: "Yes",
          handler: () => {

            this.service.callDrone(this.markerPos.addr);
            var drone = new google.maps.LatLng(43.06676934917945, -89.38905016359877);
            
            this.displayLine(this.markerPos.loc,drone);
            this.showToast("Drone is being sent!");
          } 
        },
        {
          text: "No",
          role: "cancel"
        }
      ] 
    });
    alert.present();
  }

  displayLine(location, drone)
  {
    var line = new google.maps.Polyline({
      path: [
          location,
          drone
      ],
      strokeColor: "#339900",
      strokeOpacity: 1.0,
      strokeWeight: 5,
      map: this.map
    });
    var bounds = new google.maps.LatLngBounds(location,drone);
    this.map.fitBounds(bounds);
    this.addMarker(drone,this.map,false, "drone");
  }

  showAddressConfirm(addressName,loc)
  {
    /*let actionSheet = this.actionSheetCtrl.create({
      title: "Do you want to send the drone to " + addressName + "?",
      buttons: [
        {
          text: 'Send Drone',
          role: 'destructive',
          handler: () => {
            this.confirmDrone(loc);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
 
    actionSheet.present();*/
  }

  showToast(msg)
  {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  addMarker(pos,map,draggable,name)
  {
    var m  = new google.maps.Marker({
      position: pos,
      map: map,
      draggable: draggable
    });
    if(draggable)
    {
      this.clearMarkers();
      this.showToast("Drag the marker, or hit send!");
      this.sendDrone = true;
      this.markerPos = {
        address: name,
        loc: m.getPosition()
      }
      google.maps.event.addListener(m, 'dragend', () => {
        this.markerPos = {
          address: "marker location",
          loc: m.getPosition()
        }
      });
    }
    this.markers.push(m);
    
  }

  clearMarkers()
  {
    if(this.markers.length != 0 )
    {
      for(let marker of this.markers)
      {
        marker.setMap(null);
      }
    }
    this.markers = [];
  }

}