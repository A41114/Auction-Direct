import React from 'react';
import './dropdown-menu.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLessThanEqual,faGavel,faHandshake, faCalendarDays, faCaretDown } from '@fortawesome/free-solid-svg-icons';
const DropdownMenu = ({handleOnChangeHomepageMenu}) => {
  return (
    <div className="dropdown">
      <button className="dropdown-button">Tool hỗ trợ<FontAwesomeIcon className='compare-icon' icon={faCaretDown}/></button>
      <div className="dropdown-content">
        <a onClick={()=>handleOnChangeHomepageMenu('compare')} href="#compare"><FontAwesomeIcon className='dropdown-compare-icon' icon={faLessThanEqual}/>So sánh</a>
        <a onClick={()=>handleOnChangeHomepageMenu('dgtsTool')} href="#dgtsTool"><FontAwesomeIcon className='dropdown-dgtsTool-icon' icon={faGavel}/>Thông báo đgts</a>
        <a onClick={()=>handleOnChangeHomepageMenu('partnerVnaTool')} href="#partnerVnaTool"><FontAwesomeIcon className='dropdown-vna-partner-icon' icon={faHandshake}/>Vna partner</a>
        <a onClick={()=>handleOnChangeHomepageMenu('schedule')} href="#schedule"><FontAwesomeIcon className='dropdown-schedule-icon' icon={faCalendarDays}/>Lịch</a>
      </div>
    </div>
  );
};

export default DropdownMenu;
