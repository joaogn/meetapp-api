
import { Request, Response, NextFunction } from 'express';
import { isValid, parseISO } from 'date-fns';
import * as Yup from 'yup';

export const MeetupStoreValidation = (req: Request, res: Response, next: NextFunction) => {
  const schema = Yup.object().shape({
    title: Yup.string()
      .required('Title is Required'),
    description: Yup.string()
      .required('Description is Required'),
    location: Yup.string()
      .required('Location is Required'),
    date: Yup.string()
      .required('Date is Required')
      .test(
        'date valid',
        'Invalid date format.',
        // testa se o formato da data está correto
        (value:string):boolean => isValid(parseISO(value)),
      ),
    banner_id: Yup.number()
      .required('Banner is Required'),
  });

  schema.validate(req.body).then(() => {
    next();
  }).catch((err) => {
    res.status(400).json({ error: err.message });
  });
};
