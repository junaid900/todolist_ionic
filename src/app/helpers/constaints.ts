export const _DB = {
    name: 'task_db',
    tables: {
        task_history: 'task_history',
        task: 'task'
    }
};
export function stringFormateDate(date: any){
    if(date.length > 0){
      let dateArr = date.split('T');
      if(dateArr.length > 1){
         return {date: `${dateArr[0]}`, time: `${dateArr[1]}`}
      }
    }
    return null;
  }
  
export function formatedDate(date: any) {
    if (typeof date == "string") {
        let _date = new Date(date);
        let day = _date.getDay();
        let month = _date.getMonth();
        let year = _date.getFullYear();
        let time = _date.getHours() + ":" + _date.getMinutes();
        console.log(date, { date: `${year}-${month}-${day}`, time: `${time}` });
        return { date: `${year}-${month}-${day}`, time: `${time}` }
    } else if (date instanceof Date) {
        let _date = date;
        let day = _date.getDay();
        let month = _date.getMonth();
        let year = _date.getFullYear();
        let time = _date.getHours() + ":" + _date.getMinutes();
        return { date: `${year}-${month}-${day}`, time: `${time}` }
    }
    return null
}