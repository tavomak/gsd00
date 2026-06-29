import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import PropTypes from 'prop-types';

const Input = ({
  type,
  value,
  onChange,
  name,
  placeholder,
  errors,
  register,
  rules,
  phone,
  disabled,
  text,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={phone ? 'flex items-center justify-stretch' : ''}>
      {phone && (
        <span className="flex h-[42px] items-center rounded-l-md border-gray-200  px-2">
          +56
        </span>
      )}
      <label
        htmlFor={name}
        className={`${phone ? 'w-full' : ''} relative mb-10 block border-b border-gray-200 shadow-sm focus-within:border-primary-color focus-within:ring-1 focus-within:ring-primary-color  px-4`}
      >
        <span className="block mb-8 text-2xl font-bold text-white">{text}</span>
        {register ? (
          <input
            className="w-full bg-transparent border-none peer focus:border-transparent focus:outline-none focus:ring-0"
            type={showPassword ? 'text' : type || 'text'}
            id={name}
            placeholder={placeholder}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...register(name, { ...rules })}
            disabled={disabled}
          />
        ) : (
          <input
            className="w-full bg-transparent border-none peer focus:border-transparent focus:outline-none focus:ring-0"
            type={type || 'text'}
            id={name}
            placeholder={placeholder}
            value={value.trim()}
            onChange={onChange}
            disabled={disabled}
          />
        )}

        {type === 'password' && (
          <button
            className="absolute inset-y-0 grid w-10 text-white cursor-pointer end-0 place-content-center"
            onClick={() => setShowPassword(!showPassword)}
            type="button"
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        )}

        {errors && (
          <span className="pointer-events-none absolute bottom-0 end-2.5 -translate-y-1/2 p-0.5 text-base text-red-600 transition-all">
            {errors.message}
          </span>
        )}
      </label>
    </div>
  );
};

Input.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  errors: PropTypes.shape({
    message: PropTypes.string,
  }),
  register: PropTypes.func,
  rules: PropTypes.shape({}),
  icon: PropTypes.element,
  phone: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default Input;
