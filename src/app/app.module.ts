import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login-page/login-page'
import { MainMenu } from '../pages/main-menu/main-menu'
import { UserPage } from '../pages/user-page/user-page'
import { EmergencyPage } from '../pages/emergency-page/emergency-page'
import { CreateAccountPage } from '../pages/create-account-page/create-account-page'
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GeocoderProvider } from '../providers/geocoder/geocoder';
import { AddAddressPage } from '../pages/add-address-page/add-address-page';
//import { RequestOptions } from '@angular/http';
//import { HTTP } from '@ionic-native/http';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    LoginPage,
    CreateAccountPage,
    MainMenu,
    UserPage,
    EmergencyPage,
    AddAddressPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    HttpClientModule,
    //RequestOptions,
    //HTTP
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    LoginPage,
    CreateAccountPage,
    MainMenu,
    UserPage,
    EmergencyPage,
    AddAddressPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    NativeGeocoder, 
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GeocoderProvider
  ]
})
export class AppModule {}
