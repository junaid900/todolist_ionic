import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonButton, IonCard, IonCardContent, IonCol, IonGrid, IonHeader, IonInput, IonLabel, IonRow, IonText, IonToolbar} from '@ionic/angular/standalone';


@Component({
  selector: 'app-today-card',
  templateUrl: './today-card.component.html',
  styleUrls: ['./today-card.component.scss'],
  standalone: true,
  imports: [IonLabel, IonCard,
    IonRow, IonCol, IonGrid,
    IonHeader, IonToolbar, IonButton,
    IonInput, IonCard, IonCardContent, IonText],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TodayCardComponent  implements OnInit {
  @Input({required:true}) totalTasks: string = "0";
  @Input({required:true}) completedTasks: string = "0";
  currentDate = signal("");
  constructor() { }

  ngOnInit() {
    this.currentDate.set(this.getFormattedDate());
  }
  getFormattedDate() {
    const options: any = { day: 'numeric', month: 'short', year: 'numeric' };
    const currentDate = new Date();
    return currentDate.toLocaleDateString('en-US', options);
  }

}
