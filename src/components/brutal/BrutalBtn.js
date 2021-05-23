import React from "react";
import "./Brutal.scss";
import SettingsIcon from "@material-ui/icons/Settings";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";

function BrutalBtn({
  color,
  size,
  tekst,
  width,
  height,
  customClass,
  fontColor,
  fontSize,
  icon,
}) {
  return (
    <div
      className={`brutalBtn ${customClass} `}
      style={{
        color: fontColor,
        fontSize: fontSize,
        height: height,
        width: width,
      }}
    >
      <div
        className={`brutalBtn__inner ${size}`}
        style={{
          background: color,
          width: width,
          height: height,
        }}
      >
        <div className="brutalBtn__icon">
          {icon == "SettingsIcon" && <SettingsIcon />}
          {icon == "MenuOpenIcon" && <MenuOpenIcon />}
        </div>
        <p style={{ fontSize: fontSize }}>{tekst}</p>
      </div>
      <div
        className="brutalBtn__shadow"
        style={{ width: width, height: height }}
      ></div>
    </div>
  );
}

export default BrutalBtn;
