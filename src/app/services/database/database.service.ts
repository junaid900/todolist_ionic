import { Injectable, WritableSignal, signal } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection, capSQLiteChanges } from '@capacitor-community/sqlite';
import { TaskModel } from 'src/app/models/task';
import { _DB } from '../../helpers/constaints'
import { TaskHistoryModel } from 'src/app/models/task_history';
import { BehaviorSubject, Observable } from 'rxjs';
import { Capacitor } from '@capacitor/core';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqliteConnection: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  public db!: SQLiteDBConnection;
  private tasks: WritableSignal<TaskModel[]> = signal<TaskModel[]>([]);
  DB_VERSION: number = 1;

  constructor() {
    // this.initDb();
  }
  async checkDb(): Promise<boolean> {
    try {
      if (await this.db.isDBOpen()) {
        return true;
      }
      return false;
    } catch (e) {
      console.warn("Check Db Error");
      return false;
    }

  }
  async initWeb() {
    if (this.sqliteConnection != null) {
      try {
        await this.sqliteConnection.initWebStore();
        return Promise.resolve();
      } catch (err: any) {
        return Promise.reject(new Error(err));
      }
    } else {
      return Promise.reject(new Error(`no connection open`));
    }

  }
  async checkConnection() {
    try {
      if (Capacitor.getPlatform() == "web") {
        await this.initWeb();
      }
      const ret = await this.sqliteConnection.checkConnectionsConsistency();
      const isConn = (await this.sqliteConnection.isConnection(_DB.name, false)).result;
      if (ret.result && isConn) {
        if (Capacitor.getPlatform() == "web") {
          if (this.db && await this.db?.isDBOpen()) {
            await this.sqliteConnection.saveToStore(_DB.name);
          }
        }
        this.db = await this.sqliteConnection.retrieveConnection(_DB.name, false);
      } else {
        console.log("creating connection");
        this.db = await this.sqliteConnection.createConnection(
          _DB.name,
          false,
          'no-encryption',
          this.DB_VERSION,
          false
        );
      }
      console.log("opening db");
      await this.db.open();
      console.log("opened db", await this.db.isDBOpen());
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }

  }
  async initDb() {
    try {
      await this.checkConnection();
      const schemas = `CREATE TABLE IF NOT EXISTS ${_DB.tables.task} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        color TEXT,
        type TEXT,
        task_date DATETIME,
        created_at DATETIME,
        status INTEGER DEFAULT 0,
        star INTEGER DEFAULT 0);`;

      await this.db.execute(schemas);
      this.getTasks();
      console.log("init db success");
      return true;
    } catch (e) {
      return false;
    }

  }
  async getTasks(): Promise<TaskModel[]> {
    const query = `SELECT * FROM ${_DB.tables.task}`;
    const result = await this.db.query(query);
    console.log("all tasks", result?.values);
    return result?.values as TaskModel[];
  }
  async searchTasks(strQuery: string): Promise<TaskModel[]> {
    const query = `SELECT * FROM ${_DB.tables.task} where title LIKE '%${strQuery}%' OR description LIKE '%${strQuery}%'`;
    const result = await this.db.query(query);
    console.log("search tasks", result?.values);
    return result?.values as TaskModel[];
  }
  async tasksByDate(date: string): Promise<TaskModel[]> {
    const query = `SELECT * FROM ${_DB.tables.task} where 
    date(task_date) >= date('${date} 00:00:00') and date(task_date) <= date('${date} 23:59:59') order by task_date asc`;
    const result = await this.db.query(query);
    return result?.values as TaskModel[];
  }
  async upcommingTasks(date: string): Promise<TaskModel[]> {
    const query = `SELECT * FROM ${_DB.tables.task} where 
    date(task_date) > date('${date} 23:59:59')  order by task_date asc`;
    const result = await this.db.query(query);
    return result?.values as TaskModel[];
  }
  async activeTasks(): Promise<TaskModel[]> {
    const query = `SELECT * FROM ${_DB.tables.task} where 
    status=0  order by task_date asc Limit 5000`;
    const result = await this.db.query(query);
    return result?.values as TaskModel[];
  }

  async deleteTask(taskId: number) {
    let connection = await this.checkConnection();
    const query = `delete FROM ${_DB.tables.task} where id = ${taskId}`;
    return this.db?.run(query);
  }

  async insertTask(task: TaskModel): Promise<capSQLiteChanges | undefined> {
    console.log("db", this.db);
    const insertQuery = `INSERT INTO ${_DB.tables.task} (title, description, type, task_date, created_at, color) VALUES (?, ?, ?, ?, ?, ?)`;
    return this.db?.run(insertQuery, [task.title, task.description, task.type, task.task_date, task.created_at, task.color ?? ""]);
  }
  async updateTaskStatus(status: number, taskId: any): Promise<capSQLiteChanges | undefined> {
    // let connection = await this.checkConnection();
    const updateQuery = `UPDATE ${_DB.tables.task} SET status = ? WHERE id = ?`;
    return await this.db?.run(updateQuery, [status, taskId]);
  }
  async updateTaskStar(status: number, taskId: any): Promise<capSQLiteChanges | undefined> {
    // let connection = await this.checkConnection();
    const updateQuery = `UPDATE ${_DB.tables.task} SET star = ? WHERE id = ?`;
    return await this.db?.run(updateQuery, [status, taskId]);
  }

  async updateTask(task: TaskModel): Promise<capSQLiteChanges | undefined> {
    let connection = await this.checkConnection();
    const updateQuery = `UPDATE ${_DB.tables.task} SET title = ?, description = ?, type = ?, color = ?, task_date = ? WHERE id = ?`;
    return await this.db?.run(updateQuery, [task.title, task.description, task.type, task.color, task.task_date, task.id]);
  }

}
