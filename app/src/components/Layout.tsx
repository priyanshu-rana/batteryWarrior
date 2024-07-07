import { FC, memo } from "react";
import { Outlet } from "react-router-dom";

const Layout: FC = (props) => {
  return (
    <div>
      <p>This is our layout</p>
      <Outlet />
    </div>
  );
};

export default memo(Layout);
