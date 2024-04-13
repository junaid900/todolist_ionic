import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit, WritableSignal, signal } from '@angular/core';
import { addIcons } from 'ionicons';
import { addSharp } from 'ionicons/icons';
import { TaskModel } from 'src/app/models/task';
import { DatabaseService } from 'src/app/services/database/database.service';
import { IonButton, IonButtons, IonCard, IonCardTitle, IonCol, IonGrid, IonHeader, IonInput, IonLabel, IonRow, IonToolbar, ModalController, IonContent, IonTitle, IonTextarea, IonItem, IonDatetimeButton, IonDatetime, IonModal, NavController, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { UtilsService } from 'src/app/services/common/utils.service';
import { TaskService } from 'src/app/services/task/task.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // providers: [DatabaseService],
  imports: [IonContent, IonTitle, IonCardTitle, IonButtons, IonButton,
    IonCard, IonCol, IonGrid, IonHeader, IonInput,
    IonLabel, IonRow, IonToolbar, IonTextarea, IonItem, IonDatetimeButton, IonDatetime, IonModal,
    FormsModule, IonSelect, IonSelectOption, NgIf
  ],
})
export class AddTaskComponent implements OnInit {
  @Input("editTask") editTask?: TaskModel;
  @Input("isEdit") isEdit: boolean  = false;

  color: string = "orange";
  title: string = "";
  desc: string = "";
  taskType: string = "date";
  #datetime: string = new Date().toISOString();
  get datetime(): string { return this.#datetime };
  set datetime(val: string) {
    this.#datetime = val;
    console.log(this.datetime);
  };
  // type: WritableSignal<string> = signal<string>("orange");
  constructor(private modalCtrl: ModalController, private db: DatabaseService, private utils: UtilsService,
    private taskService: TaskService, private router: Router,
    private navCtrl: NavController) {
    addIcons({ addSharp })
  }
  editLoad(){
    this.color = this.editTask!.color;
    this.title = this.editTask!.title;
    this.desc = this.editTask!.description;
    this.#datetime = this.editTask!.task_date;
  }
  ionViewDidEnter() {
    console.log("ionViewDidEnter");
    console.log(this.isEdit, this.editTask);
    if(this.isEdit && this.editTask && this.editTask.hasOwnProperty("id")){
      this.editLoad();
    }
  }
  ngOnInit() {
    // this.getTasks();
  }
  async close() {
    return this.modalCtrl.dismiss(null, "close");
  }
  changeColor(type: string) {
    this.color = type;
  }
  // dateChanged(date){

  // }
  addTask() {
    if (this.title.length < 1) {
      this.utils.showToast("Title is empty");
      return;
    }
    if (this.desc.length < 1) {
      this.utils.showToast("Description cannot be empty");
      return;
    }
    if (this.taskType.length < 1) {
      this.utils.showToast("Invalid task type");
      return;
    }
    if (this.color.length < 1) {
      this.utils.showToast("Please select a color");
      return;
    }
    if (this.taskType == "date") {
      if (this.datetime.length < 1) {
        this.utils.showToast("Please enter valid datetime");
        return;
      }
    } else {
      this.datetime = "";
    }
    let task: TaskModel = {
      title: this.title,
      description: this.desc,
      type: this.taskType,
      created_at: new Date().toISOString(),
      task_date: this.datetime,
      color: this.color,
      status: 0,
      star:0,
    };
    if(this.isEdit && this.editTask && this.editTask.hasOwnProperty("id")){
      task.id = this.editTask!.id;
      this.db.updateTask(task).then(async res=>{
        this.taskService.syncTasks();
        this.modalCtrl.dismiss();
      });
      return;
    }
    this.db.insertTask(task).then(async e => {
      console.log(e);
      this.utils.showToast("Task created successfully");
      await this.taskService.syncTasks();
      this.modalCtrl.dismiss();
    }).catch(error => {
      console.log("insert errpr", error);
    });
  }
  resetForm() {
    this.title = "";
    this.desc = "";
    this.color = "orange";
  }
}
