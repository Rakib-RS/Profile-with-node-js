import { Injectable } from '@angular/core';
import { Contact } from './contact';
import { Http, Response } from '@angular/http';
@Injectable()
export class ContactService{
  private contactsUrl = '/api/contacts';
  constructor (private http : Http) {}
  //get("/api/contacts");
  getContacts():Promise<void | Contact[]>{
    return this.http.get(this.contactsUrl)
      .toPromise()
      .then(response => response.json() as Contact[])
      .catch(this.handleError);
  }
  //post("/api/contacts")
  createContact(newContact:Contact):Promise<void | Contact>{
    resturn this.http.post(this.contactsUrl,newContact)
      .toPromise()
      .then(response => response.json() as Contact)
      .catch(this.handleError);
  }
  private handleError (error: any){
    let errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}`:'server error';
    console.error(errMsg);
  }

}