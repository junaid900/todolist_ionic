import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private toast: ToastController) { }

  showToast(message: string) {
    this.toast.create({
      message: message,
      duration: 3000,
    }).then(res => {
      res.present();
    })
  }
}
