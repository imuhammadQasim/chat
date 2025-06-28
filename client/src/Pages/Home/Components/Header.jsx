import React from 'react'
import './header.css'
import { useSelector } from 'react-redux';

const Header = () => {
    const user = useSelector((state) => state.user.user);
    // console.log("user in header:", user);
    function getFullName() {
        if (!user || !user.firstname || !user.lastname) return "Unknown";
        let fname = user.firstname.charAt(0).toUpperCase() + user.firstname.slice(1).toLowerCase();
        let lname = user.lastname.charAt(0).toUpperCase() + user.lastname.slice(1).toLowerCase();
        return `${fname} ${lname}`;
    }


    function getInitials() {
        if (!user || !user.firstname || !user.lastname) {
            return "??"; // Default initials if user data is not available
        }
        const firstInitial = user.firstname.charAt(0).toUpperCase();
        const lastInitial = user.lastname.charAt(0).toUpperCase();
        return `${firstInitial}${lastInitial}`;
    }
    return (
        <div className="app-header">
            <div className="app-logo">
                <i className="fa fa-comments" aria-hidden="true"></i>
                Quick Chat
            </div>
            <div className="app-user-profile">
                <div className="logged-user-name">{getFullName()}</div>
                <div className="logged-user-profile-pic">{getInitials()}</div>
            </div>
        </div>
    )
}

export default Header
