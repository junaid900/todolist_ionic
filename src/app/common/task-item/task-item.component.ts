import { NgIf } from '@angular/common';
import { Component, Injectable, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { IonIcon, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons';
import { formatedDate, stringFormateDate } from 'src/app/helpers/constaints';
import { TaskModel } from 'src/app/models/task';
import { AddTaskComponent } from 'src/app/pages/modal-pages/add-task/add-task.component';
import { UtilsService } from 'src/app/services/common/utils.service';
import { DatabaseService } from 'src/app/services/database/database.service';
import { TaskService } from 'src/app/services/task/task.service';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf]
})
export class TaskItemComponent implements OnInit {
  // @ViewChild('popover') popover;
  @Input({ required: true }) task!: TaskModel;
  @Input({ required: true }) type!: string;
  @Input({ required: false }) hideMarkAsComplete: boolean = false;
  @Input({ required: false }) hideStar: boolean = false;
  isShowingPopover: boolean = false;
  isToday: boolean = false;
  date?: string;
  time: string = "00:00";

  constructor(
    private db: DatabaseService,
    private taskService: TaskService,
    private utils: UtilsService,
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet
  ) {
    addIcons({starOutline,star})
   }

  ngOnInit() { 
    console.log("task date",this.task.task_date);
    let dateTime = stringFormateDate(this.task.task_date);
    if(dateTime){
      this.date = dateTime.date;
      this.time = dateTime.time.substring(0, 5);
      // console.log(stringFormateDate(new Date(Date.now()).toDateString())!.date, this.date);
      console.log(new Date().toISOString());
      if(stringFormateDate(new Date().toISOString())!.date == this.date){
        this.isToday = true;
      }
    }
  }
  openPopover() {
    this.isShowingPopover = true;
  }
  markAsComplete() {
    let status = this.task.status == 0 ? 1 : 0;
    this.db.updateTaskStatus(status, this.task.id).then((result) => {
      this.utils.showToast("Task updated successfully");
      this.taskService.syncTasks();
    }).catch(error=>{
      this.utils.showToast("Cannot delete task")
    })
  }
  async editTask() {
    console.log("editTask");
    this.modalCtrl.create({
      component: AddTaskComponent,
      presentingElement: this.routerOutlet.nativeEl,
      canDismiss: true,
      componentProps: {
        "isEdit": true,
        "editTask": this.task,
      }
    }).then(res=>{
      res.present();
    })
  }
  deleteTask() {
    console.log("deleteTask");
    try {
      this.db.deleteTask(Number(this.task.id)).then(() => {
        this.utils.showToast("Task deleted successfully");
        this.taskService.syncTasks();
      })
    } catch (err) {
      this.utils.showToast("Cannot delete task")
    }
  }
  addStar() {
    let star = this.task.star == 0 ? 1 : 0;
    this.db.updateTaskStar(star, this.task.id).then((result) => {
      this.utils.showToast("Star updated successfully");
      this.taskService.syncTodayTasks();
    }).catch(error=>{
      this.utils.showToast("Cannot update task")
    })
  }

}
