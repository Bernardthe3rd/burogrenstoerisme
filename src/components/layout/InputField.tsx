import "./InputField.css"

interface InputFieldProps {
    type: string,
    placeholder: string,
    value: string,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const InputField = ({type, placeholder, value, handleChange} : InputFieldProps) => {
    return (
        <input className="input-field"
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
        />
    );
};

InputField.propTypes = {

};

export default InputField;