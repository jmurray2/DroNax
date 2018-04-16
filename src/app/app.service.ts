import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
declare var google;
@Injectable()
export class AppService {
username = "";
password = "";

addresses : Address[];

user = ({
    firstName: 'Jon',
    lastName: 'Murray',
    addresses: new Array<Address>(new Address("1234 Street",new google.maps.LatLng(43.06442240000001
        , -89.40852519999999))),
    billingInfo: '98765'
});
    constructor(private http: HttpClient)
    {
        //this.addresses.push(new Address("Okay","0","0"));
        console.log("construct");
    }

    signIn(username,password)
    {
        //this.http.get("/user").subscribe(data => {
            // Derrive these from data.
            const loginSuccessful = true;
            const usernameCorrect = false;
            if(loginSuccessful)
            {
                this.username = "Jon";
                this.password = "test";
                return true;
            }
            else
            {
                /*let errMessage = "Username incorrect. Please try again.";
                if(usernameCorrect) { errMessage = "Password incorrect. Please try again."; }
                let alert = this.alertCtrl.create({
                message: errMessage,
                buttons:[ {
                        text: "Ok",
                        role: "cancel"
                      }]
                });
                alert.present();
                */
               return false;
            }
        //});;
    }

    createAccount(username,password)
    {
        let success = true;
        if(success)
        {
            return true;
        }
        else{
            return false;
        }
    }

    signOut()
    {
        this.username = "";
        this.password = "";
        let success = true;
        if(success)
        {
            return true;
        }
        else{
            return false;
        }
    }

    deleteAccount()
    {
        this.username = "";
        this.password = "";
        let success = true;
        if(success)
        {
            return true;
        }
        else{
            return false;
        }
    }

    addAddress(addr, loc)
    {
        console.log("Service");
        this.user.addresses.push(new Address(addr, loc));
        for(let address of this.user.addresses)
        {
            console.log(address.address);
        }
    }

    public callDrone(addr)
    {
        
        //let url = 'https://swapi.co/api/films';
        let url = 'http://10.141.166.89:8000/gui/'
        console.log(addr);
    }
}

class Address{
    address: string;
    loc: any;
    constructor (address: string, loc: any) {
        this.address = address;
        this.loc = loc;
    }
    
    
}