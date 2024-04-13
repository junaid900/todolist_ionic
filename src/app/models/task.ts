export interface TaskModel {
    id?: string;
    title: string;
    description: string;
    type: string; // Daily On time
    color: string; // Daily On time
    task_date: string;
    created_at: string;
    status: number;
    star: number;
}