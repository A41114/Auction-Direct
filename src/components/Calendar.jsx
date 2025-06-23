import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // Để hỗ trợ kéo và thả
import tippy from 'tippy.js';
import './Calendar.scss'

const CalendarComponent = ({SD, ED, BSD, BED, PN}) => {
  // Dữ liệu sự kiện mẫu
  
  const [events, setEvents] = useState([
    
    // {
    //   title: 'Meeting',
    //   start: '2025-06-03T10:30:00',
    //   end: '2025-06-03T12:30:00',
    // },
      
    //test từ props
    // {
    //   title: 'test từ props',
    //   start: SD[0][0],
    //   end: SD[0][0],
    // },
    
    


  ]);
  //start date
  const [SD_Calendar, setSD_Calendar] = useState(() => {
    if (!SD || !Array.isArray(SD)) return [];
  
    const arr = [];
    for(let i=0;i<SD.length;i++){
      for(let j=1;j<SD[i].length;j++){
        arr.push({
          title: 'HS'+SD[i][j],
          start: SD[i][0],
          // end: SD[i][0],
          description: PN[PN.indexOf(SD[i][j])+1]
        });
      }
    }
    
    return arr;
  });
  //end date
  const [ED_Calendar, setED_Calendar] = useState(() => {
    if (!ED || !Array.isArray(ED)) return [];
  
    const arr = [];
    for(let i=0;i<ED.length;i++){
      for(let j=1;j<ED[i].length;j++){
        arr.push({
          title: 'HS'+ED[i][j],
          start: ED[i][0],
          // end: ED[i][0],
          // color:'#00cda8'
          className:['ED_bg'],
          description: PN[PN.indexOf(ED[i][j])+1]
        });
      }
    }
    
    return arr;
  });
  const [BSD_Calendar, setBSD_Calendar] = useState(() => {
    if (!BSD || !Array.isArray(BSD)) return [];
  
    const arr = [];
    for(let i=0;i<BSD.length;i++){
      for(let j=1;j<BSD[i].length;j++){
        const [num,startTime]=BSD[i][j].replaceAll(' ','').split('-')
        const [numAlt,endTime]=BED[i][j].replaceAll(' ','').split('-')
        // console.log('num:',numAlt)
        // console.log('startTime:',startTime)
        // console.log('endTime:',endTime)
        arr.push({
          title: 'HS'+num,
          start: BSD[i][0]+startTime,
          end: BED[i][0]+endTime,
          //color:'red',
          className:['BSD_bg'],
          description: PN[PN.indexOf(num)+1]
        });
      }
    }
    
    return arr;
  });
  
  

  // Hàm xử lý khi người dùng thêm sự kiện (sự kiện sẽ được thêm động vào lịch)
  const handleDateClick = (arg) => {
    const newEvent = {
      title: 'New Event',
      start: arg.dateStr,
      end: arg.dateStr,
    };
    setEvents([...events, newEvent]);
  };
  // console.log('SD from props ',SD[0][0])
  // console.log('SD from props ',{SD})
  // console.log('ED from props ',{ ED })
  // console.log('BSD from props ',{ BSD })
  // console.log('BED from props ',{ BED })
  // console.log('PN from props ',{ PN })
  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    alert(`📅 Sự kiện: ${event.title}\n🕒 Bắt đầu: ${event.start}\n🕒 Kết thúc: ${event.end}`);
  };
  // console.log('PN index: ',PN.indexOf('102'))
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={SD_Calendar.concat(ED_Calendar.concat(BSD_Calendar))} // Truyền dữ liệu sự kiện vào lịch
        dateClick={handleDateClick} // Xử lý khi người dùng click vào một ngày
        eventClick={handleEventClick}
        firstDay={1}
        nowIndicator={true}//kẻ thời gian hiện tại
        slotLabelContent={() => ''} // Trả về chuỗi rỗng trong cột thời gian
        // slotLabelInterval={null} // ✅ Không chia slot theo giờ
            eventDidMount={(info) => {
              const end = info.event.end ? info.event.end.toLocaleString() : null;
              tippy(info.el, {
                content: `
                  <strong>${info.event.title}</strong><br/>
                  ${info.event.extendedProps.description}<br/>
                  <br/>
                  Bắt đầu: ${info.event.start?.toLocaleString()}<br/>
                  ${end ? `Kết thúc: ${end}` : ''}
                `,
                allowHTML: true,
                theme: 'custom', // <-- Rất quan trọng! (để viết dc css),
                animation: 'fade'
                
              });
            }}
      />
    </div>
  );
};

export default CalendarComponent;
