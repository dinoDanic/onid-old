import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/ws_icon.scss";
import { useDispatch } from "react-redux";
import { currentWsId } from "../actions";
import { Link } from "react-router-dom";
import StarRateIcon from "@material-ui/icons/StarRate";

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
      <motion.div
        className="ws_icon"
        onClick={() => setCurrendWsId()}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
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
      </motion.div>
    </Link>
  );
}

export default WS_icon;
