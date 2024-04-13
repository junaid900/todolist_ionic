import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TaskModel } from 'src/app/models/task';
import { DatabaseService } from '../database/database.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  public tasks = new BehaviorSubject<TaskModel[]>([]);
  public tasks$ = this.tasks.asObservable();
  public todayTasks = new BehaviorSubject<TaskModel[]>([]);
  public todayTasks$ = this.todayTasks.asObservable();
  public upCommingTasks = new BehaviorSubject<TaskModel[]>([]);
  public upCommingTasks$ = this.upCommingTasks.asObservable();
  public activeTasks = new BehaviorSubject<TaskModel[]>([]);
  public activeTasks$ = this.activeTasks.asObservable();
  public searchTasks = new BehaviorSubject<TaskModel[]>([]);
  public searchTasks$ = this.searchTasks.asObservable();
  public searchQuery = new BehaviorSubject<string>("");
  public searchQuery$ = this.searchTasks.asObservable();
  constructor(
    private db: DatabaseService,
  ) {
   }
  setTasks(tasks: TaskModel[]): void {
    this.tasks.next([...tasks]);
  }
  syncTasks() {
    this.syncAllTasks();
    this.syncTodayTasks();
    this.syncUpCommingTasks();
    this.syncActiveTasks();
    this.syncSearchTasks(this.searchQuery.value)
  }
  syncAllTasks() {
    this.db.getTasks().then((tasks: TaskModel[]) => {
      if (tasks)
        this.tasks.next([...tasks]);
    });
  }
  syncTodayTasks() {
    this.db.tasksByDate(new Date().toISOString().slice(0, -5).replace('T', ' ').split(" ")[0]).then((tasks: TaskModel[]) => {
      if (tasks)
        this.todayTasks.next([...tasks]);
    });
  }
  syncUpCommingTasks(){
    this.db.upcommingTasks(new Date().toISOString().slice(0, -5).replace('T', ' ').split(" ")[0]).then((tasks: TaskModel[]) => {
      if (tasks)
        this.upCommingTasks.next([...tasks]);
    });
  }
  syncActiveTasks(){
    this.db.activeTasks().then((tasks: TaskModel[]) => {
      if (tasks)
        this.activeTasks.next([...tasks]);
    });
  }
  syncSearchTasks(query: string){
    // if(!(query.length > 0)){
    //   return;
    // }
    this.db.searchTasks(query).then((tasks: TaskModel[]) => {
      if (tasks)
        this.searchTasks.next([...tasks]);
    });
  }
}
