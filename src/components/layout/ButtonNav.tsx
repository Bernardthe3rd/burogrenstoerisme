import {NavLink} from "react-router-dom";
import "./ButtonNav.css"

interface ButtonNavProps {
    path: string;
    text: string;
}

const ButtonNav = ({path, text} : ButtonNavProps) => {
    return (
        <li>
            <NavLink to={path} className={({isActive}) => isActive ? "button-nav-active" : "button-nav-default"} >
                {text}
            </NavLink>
        </li>
    );
};

export default ButtonNav;