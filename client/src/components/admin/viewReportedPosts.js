import "../component_css/ProfileEdit.css";
import React, { useState } from "react";
import { useUser } from "../../userContext";

const viewReportedPosts = () => {
  return (
    <div className="profile-edit">
      <h2>Edit test Profile</h2>

      <div className="profile-container"></div>

      <button type="submit" className="confirm-button">
        Confirm
      </button>
    </div>
  );
};

export default viewReportedPosts;
