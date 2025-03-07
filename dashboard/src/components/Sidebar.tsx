import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import { theme } from "../constants/theme";
import { FiHome } from "react-icons/fi";
import { GoPeople } from "react-icons/go";
import {
  MdOutlineFastfood,
  MdOutlineFormatListNumbered,
  MdSecurity,
} from "react-icons/md";
import LogoIcon from "../assets/images/logo-icon.png";
import Logo from "../assets/images/white-logo.png";
import { CiBarcode } from "react-icons/ci";
import { LiaTableSolid } from "react-icons/lia";
import { RiRestaurant2Line } from "react-icons/ri";

const SidebarComponent = ({ isCollapsed, isToggled, setIsToggled }: any) => {

  return (
    <Sidebar
      breakPoint="md"
      backgroundColor={theme.colors.darkBlue}
      width="300px"
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
          flexShrink: 0
        }}
      >
        {isCollapsed ? (
          <img
            src={LogoIcon}
            alt="logo"
            style={{
              height: "60px",
              transition: "margin-right 0.3s",
              objectFit: "cover",
              padding: "5px",
            }} />
        ) : <img
          src={Logo}
          alt="logo"
          style={{
            height: "150px",
            transition: "margin-right 0.3s",
            objectFit: "cover",
            padding: "20px",
          }} />
        }
      </div>
      <div>
        <Menu
          closeOnClick={true}
          menuItemStyles={{
            button: {
              padding: "0px 20px",
              display: "flex",
              justifyContent: "center",
              fontSize: "15px",
              backgroundColor: theme.colors.darkBlue,
              color: theme.colors.white,
              alignItems: "center",
              ...theme.fonts.bold,
              ":hover": {
                background: theme.colors.lightWhite,
              },
            },
            subMenuContent: {
              backgroundColor: theme.colors.darkBlue,
              ":hover": {
                background: theme.colors.lightWhite,
                borderRadius: "8px",
              },
            }
          }}
        >
          <MenuItem
            icon={<FiHome size="22" />}
            component={<Link to="/dashboard" />}
            rootStyles={{
              color: theme.colors.white,
            }}
          >
            Dashboard
          </MenuItem>
          <SubMenu
            label={"Orders"}
            icon={<MdOutlineFormatListNumbered size="22" />}
          >
            <MenuItem
              icon={
                <span
                  style={{ fontSize: "16px", color: theme.colors.white }}
                >
                  -
                </span>
              }
              component={<Link to="/orders" />}
            >
              List
            </MenuItem>
          </SubMenu>
          <SubMenu label={"Foods"} icon={<MdOutlineFastfood size="22" />}>
            <MenuItem
              icon={
                <span
                  style={{ fontSize: "16px", color: theme.colors.white }}
                >
                  -
                </span>
              }
              component={<Link to="/food" />}
            >
              List
            </MenuItem>
            <MenuItem
              icon={
                <span
                  style={{ fontSize: "16px", color: theme.colors.white }}
                >
                  -
                </span>
              }
              component={<Link to="/food/create" />}
            >
              Add
            </MenuItem>
            <MenuItem
              icon={
                <span
                  style={{ fontSize: "16px", color: theme.colors.white }}
                >
                  -
                </span>
              }
              component={<Link to="/food/createCategory" />}
            >
              Add Category
            </MenuItem>
          </SubMenu>

          <SubMenu
            label={"Clients"}
            icon={<MdOutlineFormatListNumbered size="22" />}
          >
            <MenuItem
              icon={
                <span
                  style={{ fontSize: "16px", color: theme.colors.white }}
                >
                  -
                </span>
              }
              component={<Link to="/client/menu" />}
            >
              Menu List
            </MenuItem>
            <MenuItem
              icon={
                <span
                  style={{ fontSize: "16px", color: theme.colors.white }}
                >
                  -
                </span>
              }
              component={<Link to="/client/orders" />}
            >
              Orders
            </MenuItem>
            <MenuItem
              icon={
                <span
                  style={{ fontSize: "16px", color: theme.colors.white }}
                >
                  -
                </span>
              }
              component={<Link to="/client/cart" />}
            >
              Cart
            </MenuItem>
          </SubMenu>

          <MenuItem
            icon={<MdSecurity size="22" />}
            component={<Link to="/permissions" />}
          >
            Permissions
          </MenuItem>
          <MenuItem
            icon={<CiBarcode size="22" />}
            component={<Link to="/client/barcodes" />}
          >
            Barcodes
          </MenuItem>
          <MenuItem
            icon={<LiaTableSolid size="22" />}
            component={<Link to="/client/tables" />}
          >
            Tables
          </MenuItem>

          <SubMenu label={"Customer"} icon={<GoPeople size="22" />}>
            <MenuItem
              icon={
                <span
                  style={{ fontSize: "16px", color: theme.colors.white }}
                >
                  -
                </span>
              }
              component={<Link to="/feature-1" />}
            >
              List
            </MenuItem>
            <MenuItem
              icon={
                <span
                  style={{ fontSize: "16px", color: theme.colors.white }}
                >
                  -
                </span>
              }
              component={<Link to="/feature-1" />}
            >
              Detail
            </MenuItem>
            <MenuItem
              icon={
                <span
                  style={{ fontSize: "16px", color: theme.colors.white }}
                >
                  -
                </span>
              }
              component={<Link to="/feature-1" />}
            >
              Add
            </MenuItem>
            <MenuItem
              icon={
                <span
                  style={{ fontSize: "16px", color: theme.colors.white }}
                >
                  -
                </span>
              }
              component={<Link to="/feature-1" />}
            >
              Edit
            </MenuItem>
          </SubMenu>

          <SubMenu label={"Restaurant"} icon={<RiRestaurant2Line size="22" />}>
            <MenuItem
              icon={
                <span
                  style={{ fontSize: "16px", color: theme.colors.white }}
                >
                  -
                </span>
              }
              component={<Link to="/tenants" />}
            >
              All Restaurant
            </MenuItem>
            <MenuItem
              icon={
                <span
                  style={{ fontSize: "16px", color: theme.colors.white }}
                >
                  -
                </span>
              }
              component={<Link to="/managers" />}
            >
              All Managers
            </MenuItem>
          </SubMenu>
        </Menu>
      </div>
    </Sidebar>
  );
};

export default SidebarComponent;
