import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <main>
        <Outlet /> {/* This is where nested routes will be rendered */}
      </main>
    </div>
  );
};

export default Layout;