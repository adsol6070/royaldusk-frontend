import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { theme } from "../constants/theme";
import LogoIcon from "../assets/images/logo-icon.png";
import Logo from "../assets/images/white-logo.png";
import { sidebarMenuItems } from "../constants/sidebarMenuConfig";

const SidebarComponent = ({ isCollapsed, isToggled, setIsToggled }: any) => {
  return (
    <Sidebar
      breakPoint="md"
      backgroundColor={theme.colors.sidebarBackground}
      width={theme.layout.sidebarWidth}
      transitionDuration={500}
      collapsed={isCollapsed}
      toggled={isToggled}
      onBackdropClick={() => setIsToggled((prevState: boolean) => !prevState)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "10px 20px",
          borderBottom: `1px solid ${theme.colors.offWhite}`,
          flexShrink: 0,
        }}
      >
        <img
          src={isCollapsed ? LogoIcon : Logo}
          alt="logo"
          style={{
            height: isCollapsed ? "60px" : "150px",
            transition: "margin-right 0.3s",
            objectFit: "cover",
            padding: isCollapsed ? "5px" : "20px",
          }}
        />
      </div>

      {/* Menu Section */}
      <Menu
        closeOnClick={true}
        menuItemStyles={{
          button: {
            padding: "0px 20px",
            display: "flex",
            justifyContent: "center",
            fontSize: "15px",
            color: theme.colors.menuText,
            alignItems: "center",
            ...theme.fonts.bold,
            ":hover": {
              background: theme.colors.menuHover,
            },
          },
          subMenuContent: {
            backgroundColor: theme.colors.subMenuBackground,
          },
        }}
      >
        {sidebarMenuItems.map((menu) =>
          menu.subMenu ? (
            <SubMenu key={menu.label} label={menu.label} icon={menu.icon}>
              {menu.subMenu.map((subItem) => (
                <MenuItem
                  key={subItem.label}
                  icon={subItem.icon}
                  component={<Link to={subItem.path} />}
                >
                  {subItem.label}
                </MenuItem>
              ))}
            </SubMenu>
          ) : (
            <MenuItem
              key={menu.label}
              icon={menu.icon}
              component={<Link to={menu.path} />}
            >
              {menu.label}
            </MenuItem>
          )
        )}
      </Menu>
    </Sidebar>
  );
};

export default SidebarComponent;
