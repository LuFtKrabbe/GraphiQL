import { FormHandlersSignUp } from '../../types/forms';
import { useState } from 'react';

import './FormFields.scss';

export function PasswordFieldConfirm({ register, errors }: FormHandlersSignUp) {
  const [isOpenedPassword, setIsOpenedPassword] = useState(false);

  return (
    <>
      <div className="field" data-testid="confirm-password-field">
        <label htmlFor="confirmPassword">Confirm password:</label>
        <input
          type={isOpenedPassword ? 'text' : 'password'}
          id="confirmPassword"
          {...register('confirmPassword')}
        ></input>
        <div
          className={
            isOpenedPassword ? 'password-opened-eye' : 'password-closed-eye'
          }
          onClick={() => setIsOpenedPassword(!isOpenedPassword)}
          data-testid="confirm-password-eye"
        ></div>
      </div>
      {errors.confirmPassword && (
        <p className="error-message">{errors.confirmPassword.message}</p>
      )}
    </>
  );
}