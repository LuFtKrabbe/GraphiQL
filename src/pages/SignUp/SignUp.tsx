import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { SignUpForm } from '../../types/forms';
import { validationSchemaSignUp } from '../../utils/validationRules';
import { userAuth } from '../../services/firebaseAuth';

import Header from '../../components/Header/Header';

import './SignUp.scss';

export default function SignUp() {
  const [isOpenedPassword, setIsOpenedPassword] = useState(false);
  const [isOpenedPasswordConfirm, setIsOpenedPasswordConfirm] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const navigate = useNavigate();

  const form = useForm({
    mode: 'all',
    resolver: yupResolver(validationSchemaSignUp),
  });
  const { register, handleSubmit, formState } = form;
  const { errors, isValid } = formState;

  const onFormSubmit = async (data: SignUpForm): Promise<void> => {
    setIsRegistering(true);
    try {
      await userAuth.registerWithEmailAndPassword(data);
      navigate('/sign-in');
    } catch (err) {
      console.log(err);
      alert(err);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <>
      <Header />
      <section className="form-section">
        <div className="form-container">
          <div className="sign-title">Sign Up</div>
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="sign-form"
            noValidate
          >
            <div className="fields-container">
              <div className="field">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" {...register('name')}></input>
              </div>
              {errors.name && (
                <p className="error-message">{errors.name.message}</p>
              )}
              <div className="field">
                <label htmlFor="email">E-mail:</label>
                <input type="email" id="email" {...register('email')}></input>
              </div>
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
              <div className="field">
                <label htmlFor="password">Password:</label>
                <input
                  type={isOpenedPassword ? 'text' : 'password'}
                  id="password"
                  {...register('password')}
                ></input>
                <div
                  className={
                    isOpenedPassword
                      ? 'password-opened-eye'
                      : 'password-closed-eye'
                  }
                  onClick={() => setIsOpenedPassword(!isOpenedPassword)}
                ></div>
              </div>
              {errors.password && (
                <p className="error-message">{errors.password.message}</p>
              )}
              <div className="field">
                <label htmlFor="confirmPassword">Confirm password:</label>
                <input
                  type={isOpenedPasswordConfirm ? 'text' : 'password'}
                  id="confirmPassword"
                  {...register('confirmPassword')}
                ></input>
                <div
                  className={
                    isOpenedPasswordConfirm
                      ? 'password-opened-eye'
                      : 'password-closed-eye'
                  }
                  onClick={() =>
                    setIsOpenedPasswordConfirm(!isOpenedPasswordConfirm)
                  }
                ></div>
              </div>
              {errors.confirmPassword && (
                <p className="error-message">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <button type="submit" disabled={!isValid} className="submit-btn">
              {isRegistering ? 'REGISTERING...' : 'SIGN UP'}
            </button>
          </form>
          <div className="sign-text">
            Already have an account?{' '}
            <Link to="/sign-in" className="sign-link">
              Sign in!
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
