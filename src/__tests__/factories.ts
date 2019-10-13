import faker from 'faker';
import factory from 'factory-girl';
import User from '../app/models/User';
import Meetup from '../app/models/Meetup';
import File from '../app/models/File';


export interface UserTypes {
   id?: number;
   name: string;
   email: string;
   password: string;
   password_hash?: string;
   created_at?: Date;
   updated_at?: Date;
  }

factory.define<UserTypes>('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});


export interface MeetupType {
   id?: number;
   title?: string;
   description?: string;
   location?: string;
   date?: Date;
   banner_id?: number;
   user_id?: number;
   user?: {
    name?: string;
    email?: string;
  }
  file?: {
    path?: string;
    url?: string;
  }
   past?: boolean;
   created_at?: Date;
   updated_at?: Date;
}

factory.define<MeetupType>('Meetup', Meetup, {
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  location: faker.address.streetAddress(),
  date: faker.date.future(),
});

export interface FileType {
   id?: number;
   name?: string;
   path?: string;
   url?: string;
   created_at?: Date;
   updated_at?: Date;
}

factory.define<FileType>('File', File, {
  name: faker.system.commonFileName('.jpg'),
  path: `${faker.random.uuid()}.jpg`,
});

export default factory;
