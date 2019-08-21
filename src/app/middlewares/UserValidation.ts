import { Request, Response, NextFunction } from 'express';
import * as Yup from 'yup';

export const UserStoreValidation = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Yup.object().shape({
    name: Yup.string()
      .required('Name is Required'),
    email: Yup.string()
      .email()
      .required('Email is Required'),
    password: Yup.string()
      .required('Password is Required')
      .min(6),
  });

  schema.validate(req.body).then(() => {
    next();
  }).catch((err) => {
    res.status(400).json({ error: err.message });
  });
};

export const UpdateStoreValidation = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Yup.object().shape({
    name: Yup.string(),
    email: Yup.string().email(),
    oldPassword: Yup.string().min(6),
    password: Yup.string()
      .min(6)
      .when('oldPassword', (oldPassword, field) =>
        (oldPassword ? field.required('Password is Required') : field)),
    confirmPassword: Yup.string()
      .when('password', (password, field) =>
        (password ? field.required('Confirm Password is Required')
          .oneOf([Yup.ref('password')], 'Confirm Password is Wrong') : field)),
  });

  schema.validate(req.body).then(() => {
    next();
  }).catch((err) => {
    res.status(400).json({ error: err.message });
  });
};
