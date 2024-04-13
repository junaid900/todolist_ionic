import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
  IonLabel, IonTitle, IonCard,
  IonRow, IonCol, IonGrid,
  IonHeader, IonToolbar, IonButton,
  IonInput, IonSegment, IonSegmentButton, IonContent,
  IonBackButton
} from '@ionic/angular/standalone'
import { TaskItemComponent } from 'src/app/common/task-item/task-item.component';
import { TaskModel } from 'src/app/models/task';
import { TaskService } from 'src/app/services/task/task.service';
import { DatabaseService } from 'src/app/services/database/database.service';

@Component({
  selector: 'app-search-task',
  templateUrl: './search-task.page.html',
  styleUrls: ['./search-task.page.scss'],
  standalone: true,
  imports: [IonContent, IonLabel, IonTitle, IonCard,
    IonRow, IonCol, IonGrid,
    IonHeader, IonToolbar, IonButton, IonBackButton,
    IonInput, IonSegment, IonSegmentButton, TaskItemComponent, NgIf, NgFor]
})
export class SearchTaskPage implements OnInit {
  searchTasks: WritableSignal<TaskModel[]> = signal([]);

  constructor(
    private taskService: TaskService,
    private db: DatabaseService
  ) {
    this.taskService.searchTasks$.subscribe(tasks => {
      this.searchTasks.update(prev => tasks);
    })
  }
  async getPageData() {
    if (!(await this.db.checkDb())) {
      this.db.initDb();
    }

  }
  ngOnInit() {
  }
  searchChange(event: CustomEvent) {
    this.taskService.searchTasks.next(event.detail.value.length);
    if (event.detail.value.length > 0)
      this.taskService.syncSearchTasks(event.detail.value);
    else {
      this.taskService.activeTasks.next([]);
    }
  }

}
