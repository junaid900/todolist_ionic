import { CommonModule, NgFor, NgIf } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, Input, ViewChild, WritableSignal, signal } from '@angular/core';
import { IonButton, IonCard, IonCol, IonContent, IonFooter, IonGrid, IonHeader, IonIcon, IonInput, IonLabel, IonRouterOutlet, IonRow, IonSegment, IonSegmentButton, IonTitle, IonToolbar, IonicSlides, ModalController } from '@ionic/angular/standalone';
import Swiper from 'swiper';
import { SwiperContainer, register } from 'swiper/element/bundle'
import { TodayCardComponent } from './today-card/today-card.component';
import { TaskItemComponent } from '../../common/task-item/task-item.component';
import { AddTaskComponent } from '../modal-pages/add-task/add-task.component';
import { FormsModule } from '@angular/forms';
import { TaskModel } from 'src/app/models/task';
import { DatabaseService } from 'src/app/services/database/database.service';
import { TaskService } from 'src/app/services/task/task.service';
import { Router } from '@angular/router';
register();

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  // providers: [DatabaseService],
  imports: [IonFooter, IonLabel, IonTitle, IonCard,
    IonRow, IonCol, IonGrid,
    IonHeader, IonToolbar, IonButton,
    IonInput, IonSegment, IonSegmentButton,
    TodayCardComponent, TaskItemComponent, IonContent, FormsModule, IonIcon, NgFor, NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage {
  @ViewChild('swiper')
  swiperRef!: ElementRef<SwiperContainer> | undefined;
  swiper?: Swiper | undefined;
  search: string = "";
  currentTab: string = "0";
  currentDate = Date.now();
  todayTask: WritableSignal<TaskModel[]> = signal([]);
  upCommingTasks: WritableSignal<TaskModel[]> = signal([]);
  activeTasks: WritableSignal<TaskModel[]> = signal([]);
  totalTasks: WritableSignal<number> = signal(0);
  totalCompletedTasks: WritableSignal<number> = signal(0);

  constructor(
    private addTaskModalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
    private tasksService: TaskService,
    private db: DatabaseService,
    private router: Router
  ) {
    this.initTasks();
  }
  initTasks(){
    this.tasksService.todayTasks$.subscribe((tasks: TaskModel[]) => {
      console.log("tasks updated");
      try {
        this.todayTask.update(prevTasks => [...tasks]);
        this.totalTasks.update(a => tasks.length);
        this.totalCompletedTasks.update(a => tasks.filter(task => task.status == 1).length);
      } catch (e) { }
    });
    this.tasksService.upCommingTasks$.subscribe((tasks: TaskModel[]) => {
      try {
        this.upCommingTasks.update(pre => tasks);
      } catch (e) { }
    });
    this.tasksService.activeTasks$.subscribe((tasks: TaskModel[]) => {
      try {
        this.activeTasks.update(pre => tasks);
      } catch (e) { }
    });
  }
  ionViewDidEnter() {
    this.getPageData();
  }

  async getPageData() {
    if (!(await this.db.checkDb())) {
      console.log("db not init");
      await this.db.initDb();
    }
    console.log("loading Tasks");
    this.tasksService.syncTasks();
  }
  swiperReady(event: any) { }
  segmentChanged(event: any) {
    this.getPageData();
    this.currentTab = event.detail.value;
    if (this.swiperRef!.nativeElement.swiper != undefined)
      this.swiperRef!.nativeElement.swiper.slideTo(Number(this.currentTab));
  }
  onSlideChange(event: any) {
    if (event.detail.length > 0) {
      let index = event.detail[0].activeIndex;
      this.currentTab = index.toString();
    }
  }
  async openAddTaskModal() {
    let modal = await this.addTaskModalCtrl.create({
      component: AddTaskComponent,
      presentingElement: this.routerOutlet.nativeEl,
      // canDismiss: true,
      // showBackdrop: true,
      // componentProps: {
      //   data: event,
      // },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === "confirm") {
    }
  }
  openSearch(){
    this.router.navigate(['search-task']);
  }
}
