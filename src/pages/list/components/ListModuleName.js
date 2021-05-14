import React from "react";
import "../../../styles/listModuleName.scss";

function ListModuleName() {
  return (
    <div className="lmn">
      <div className="lmn__deadLine lmn__item">
        <p>Created By</p>
      </div>
      <div className="lmn__createdDate lmn__item">
        <p>Created Date</p>
      </div>
      <div className="lmn__createdBy lmn__item">
        <p>Deadline</p>
      </div>
    </div>
  );
}

export default ListModuleName;
