import React from "react";
import { FaUserCircle } from "react-icons/fa";

const ProfilePicture = ({ size = 80, color = "#FFD700" }) => {
    return <FaUserCircle size={size} color={color} />;
};

export default ProfilePicture;
