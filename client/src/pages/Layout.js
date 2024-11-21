import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <header>Header Content</header>
      <main>
        <Outlet /> {/* This is where nested routes will be rendered */}
      </main>
      <footer>Footer Content</footer>
    </div>
  );
};

export default Layout;