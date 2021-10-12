import { ErrorMessage } from 'react-hook-form';
import { Input } from '../Styled';

const FormInput = ({ register, name, errors, required = false, ...rest }) => (
  <>
    <Input name={name} {...rest} {...register(name, { required: true })} />
    {errors && errors[name] && (
      <ErrorMessage errors={errors} name={name}>
        {({ message }) => <p style={{ color: 'red' }}>{message}</p>}
      </ErrorMessage>
    )}
  </>
);

const FormSelect = ({ children, register, name, errors, required = false, ...rest }) => (
  <>
    <Input as="select" name={name} {...register(name, { required: true })} {...rest}>
      {children}
    </Input>
    {errors && errors[name] && (
      <ErrorMessage errors={errors} name={name}>
        {({ message }) => <p style={{ color: 'red' }}>{message}</p>}
      </ErrorMessage>
    )}
  </>
);

export default FormInput;
export { FormSelect };
