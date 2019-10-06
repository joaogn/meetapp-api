import { Request, Response, NextFunction } from 'express';
import * as Yup from 'yup';


export default async (req: Request, res: Response, next: NextFunction) => {
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
