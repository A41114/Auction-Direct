import React from 'react';
// import './dropdown-menu.scss'
import './user-name-dropdown.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,faClockRotateLeft,faRightFromBracket, faCalendarDays, faCaretDown } from '@fortawesome/free-solid-svg-icons';
const UserNameDropdown = ({handleOnChangeHomepageMenu,userName,handleLogout,ToUserDetails}) => {
  return (
    <div className="dropdown">
      <button className="dropdown-button">{userName}</button>
      <div className="dropdown-content">
        <a onClick={()=>ToUserDetails()} href="#accountInfo"><FontAwesomeIcon className='dropdown-compare-icon' icon={faUser}/>Tài khoản</a>
        <a href="#tradeHistory"><FontAwesomeIcon className='dropdown-dgtsTool-icon' icon={faClockRotateLeft}/>Lịch sử giao dịch</a>
        <a onClick={()=>handleLogout()} href="#logout"><FontAwesomeIcon className='dropdown-vna-partner-icon' icon={faRightFromBracket}/>Đăng xuất</a>
      </div>
    </div>
  );
};

export default UserNameDropdown;
