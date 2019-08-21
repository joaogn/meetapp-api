import { Request, Response, NextFunction } from 'express';
import * as Yup from 'yup';

export default async (req: Request, res: Response, next: NextFunction) => {
  const schema = Yup.object().shape({
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
