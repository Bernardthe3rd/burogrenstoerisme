import "./ButtonLink.css"

interface ButtonLinkProps {
    type?: "submit" | "reset" | "button" | undefined,
    text: string,
}

const ButtonLink = ({ type, text } : ButtonLinkProps) => {
    return (
        <button type={type} className="button-link" >
            {text}
        </button>
    );
};

ButtonLink.propTypes = {

};

export default ButtonLink;