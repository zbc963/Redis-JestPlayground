// import React, {useState, useEffect} from 'react';

// const Test = ()=>{
//   let target = new Date('2020-10-11 23:35').getTime();
//   let diff = Math.floor((target - Date.now())/1000);
//   const [cur, setCur] = useState(diff);
//   let [dateInfo, setDateInfo] = useState({
//     day:0,
//     min:0,
//     sec:0,
//     hour:0
//   });
//   useEffect(()=>{
//    const timer = setTimeout(()=>{
//      if(cur){
//       setCur(cur-1);
//       let day =  Math.floor(cur%(60 * 60 * 24)/(60*60*24));
//       let hour = Math.floor((cur%( 60 * 60 * 24))/(60*60));
//       let min = Math.floor((cur%( 60 * 60))/60);
//       let sec = cur%60;
//       setDateInfo({
//         day, hour, min, sec
//       });
//      }
//    }, 1000);
   
//    return ()=>{clearTimeout(timer)};
//   },[cur])

//   return(
//     <div>
//       { cur ?
//         <div>
//         <div>day: {dateInfo.day}</div>
//         <div>hour: {dateInfo.hour}</div>
//         <div>min: {dateInfo.min}</div>
//         <div>sec: {dateInfo.sec}</div>
//         </div>
//         :
//         <div>到期了，亲！</div>
//       }
//     </div>
//   )
// }

// export default Test;