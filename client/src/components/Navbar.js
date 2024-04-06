import './component_css/Navbar.css';
import { List} from "@phosphor-icons/react";
import { useSideBarContext } from './SidebarComp/SideBarContext';
const Navbar = () => {
  const { isOpen, setIsOpen } = useSideBarContext(); // Use context to get state and updater

  const handleButtonClick = () => {
    setIsOpen(!isOpen); // Toggle the state based on its current value
  };

  

  return (
    <div className="navbar">
        <button onClick={handleButtonClick} className="List-icon-button">
          <List className="List-icon" />
        </button>
      <input type="text" placeholder="Search..." className="search-bar"/>
    </div>
  );
};

export default Navbar;