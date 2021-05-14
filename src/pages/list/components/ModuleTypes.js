import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../../styles/moduleTypes.scss";

function ModuleTypes({ name, order }) {
  const [moduleOrder, setModuleOrder] = useState(0);
  const activeModules = useSelector((state) => state.activeModules);
  const [activeState, setActiveState] = useState(false);

  useEffect(() => {
    if ((name, order)) {
      setModuleOrder(order[name]);
    }
  }, [order, name]);

  useEffect(() => {
    if (activeModules.includes(name)) {
      setActiveState(true);
    } else {
      setActiveState(false);
    }
  }, [activeModules]);
  return (
    <>
      {activeState && (
        <div className="moduleTypes">
          <div className="moduleTypes__item">
            <p>{name}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default ModuleTypes;
