import PropTypes from "prop-types";
import { findInputError } from "../../utils/findInputError.js";
import { isFormInvalid } from "../../utils/isFormInvalid.js";
import { useFormContext } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { MdError } from "react-icons/md";

const Input = (props) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const inputError = findInputError(errors, props.name);
  const isInvalid = isFormInvalid(inputError);

  return (
    <div className="flex flex-col font-BreeSerif">
      <div className="flex flex-col mb-2">
        <label>{props.label}</label>
        <AnimatePresence mode="wait" initial={false}>
          {isInvalid && (
            <InputError
              message={inputError.error.message}
              key={inputError.error.message}
            />
          )}
        </AnimatePresence>
      </div>
      {
        {
          input: (
            <input
              className="h-11 p-2 border-gray-200 rounded-md border-2  shadow-sm "
              id={props.id}
              type={props.type}
              min={props.min}
              max={props.max}
              placeholder={props.placeholder}
              name={props.name}
              value={props.value}
              onChange={props.onChange}
              autoComplete={props.autoComplete}
              {...register(props.name, props.validation)}
            />
          ),
          textarea: (
            <textarea
              className="h-11 p-2 border-gray-200 rounded-md border-2  shadow-sm"
              id={props.id}
              type={props.type}
              placeholder={props.placeholder}
              name={props.name}
              autoComplete={props.autoComplete}
              {...register(props.name, props.validation)}
            />
          ),
        }[props.formtype]
      }
    </div>
  );
};

const InputError = ({ message }) => {
  return (
    <motion.p
      className="flex items-center gap-1 px-2 font-semibold text-red-500 bg-red-100 rounded-md"
      {...framer_error}
    >
      <MdError />
      {message}
    </motion.p>
  );
};

const framer_error = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.3, type: "tween", ease: "easeInOut" },
};

Input.propTypes = {
  formtype: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  validation: PropTypes.object,
  name: PropTypes.string,
  options: PropTypes.array,
  min: PropTypes.string,
  max: PropTypes.string,
  value: PropTypes.any,
  autoComplete: PropTypes.string,
};

InputError.propTypes = {
  message: PropTypes.string,
};

export default Input;
