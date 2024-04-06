import '../component_css/Navbar.css';
import { List} from "@phosphor-icons/react";

const Navbar = ({ isOpen, setIsOpen }) => {
  const handleButtonClick = () => {
    setIsOpen(prevState => !prevState); // Toggle the state
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