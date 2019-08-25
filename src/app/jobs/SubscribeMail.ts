import Mail from '../../lib/Mail';
import { MeetupType } from '../controllers/MeetupController';
import { UserType } from '../controllers/UserController';

interface Data {
  meetup: MeetupType
  user: UserType
}

class SubscribeMail {
  // cria a chave do job
  get key() {
    return 'SubscribeMail';
  }

  // cria o 'valor' do job
  async handle({ data }) {
    const { meetup, user }:Data = data;
    await Mail.sendMail({
      to: `${meetup.user.name} <${meetup.user.email}>`,
      subject: 'Novo Participante Inscrito',
      template: 'newsubscribe',
      context: {
        user: meetup.user.name,
        meetup: meetup.title,
        resgisteredUser: user.name,
        email: user.email,
      },
    });
  }
}

export default new SubscribeMail();
