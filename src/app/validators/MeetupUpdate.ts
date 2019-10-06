import { Request, Response, NextFunction } from 'express';
import { isValid, parseISO } from 'date-fns';
import * as Yup from 'yup';

export default (req: Request, res: Response, next: NextFunction) => {
  const schema = Yup.object().shape({
    title: Yup.string(),
    description: Yup.string(),
    location: Yup.string(),
    date: Yup.string()
      .test(
        'date valid',
        'Invalid date format.',
        // testa se o formato da data está correto
        (value:string):boolean => isValid(parseISO(value)),
      ),
    banner_id: Yup.number(),
  });

  schema.validate(req.body).then(() => {
    next();
  }).catch((err) => {
    res.status(400).json({ error: err.message });
  });
};
