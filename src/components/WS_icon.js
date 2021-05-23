import React, { useEffect, useState } from "react";
import "../styles/ws_icon.scss";
import { useDispatch } from "react-redux";
import { currentWsId } from "../actions";
import { Link } from "react-router-dom";
import StarRateIcon from "@material-ui/icons/StarRate";
import Button from "./brutal/BrutalBtn";
import BrutalBtn from "./brutal/BrutalBtn";

function WS_icon({ name, id, mainWsLink, color }) {
  const dispatch = useDispatch();
  const [star, setStar] = useState(false);

  const setCurrendWsId = () => {
    dispatch(currentWsId(id));
  };

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
      {/*  <div className="ws_icon" onClick={() => setCurrendWsId()}>
        {star && (
          <div className="ws_icon__star">
            <StarRateIcon />
          </div>
        )}
        <div
          className="ws_icon__letter onlyLatter"
          style={{ background: color }}
        >
          <p aria-label={name}>{name.charAt(0)}</p>
        </div>
      </div> */}
    </Link>
  );
}

export default WS_icon;
