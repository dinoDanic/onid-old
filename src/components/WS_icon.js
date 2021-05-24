import React, { useEffect, useState } from "react";
import "../styles/ws_icon.scss";
import { Link } from "react-router-dom";
import BrutalBtn from "./brutal/BrutalBtn";

function WS_icon({ name, id, mainWsLink, color }) {
  const [star, setStar] = useState(false);

  useEffect(() => {
    const getStar = () => {
      if (mainWsLink === id) {
        setStar(true);
      }
    };
    getStar();
  }, [mainWsLink, id]);
  return (
    <Link to={`/ws/${id}`}>
      <div className="ws_icon-burtalBtn">
        <BrutalBtn
          color={color}
          tekst={name.charAt(0)}
          width="30px"
          height="30px"
          customClass="ws_icon_btn"
        />
        {star && <div className="ws_icon__star"></div>}
      </div>
    </Link>
  );
}

export default WS_icon;
