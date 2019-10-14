import File from '../../app/models/File';
import Meetups from '../../app/models/Meetup';
import Subscription from '../../app/models/Subscription';
import User from '../../app/models/User';

const models = [File, Subscription, Meetups, User];

export default function truncate() {
  return Promise.all(
    models.map((model) => model.destroy({ truncate: true, force: true })),
  );
}
