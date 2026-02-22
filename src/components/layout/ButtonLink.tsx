import "./ButtonLink.css"

interface ButtonLinkProps {
    type?: "submit" | "reset" | "button" | undefined,
    text: string,
    disabled?: boolean
}

const ButtonLink = ({ type, text, disabled } : ButtonLinkProps) => {
    return (
        <button type={type} className="button-link" disabled={disabled} >
            {text}
        </button>
    );
};

ButtonLink.propTypes = {

};

export default ButtonLink;