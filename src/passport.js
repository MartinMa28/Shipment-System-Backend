import { Strategy as LocalStrategy } from 'passport-local';
import withDb from './database/dbUtils';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

function initialize(passport) {
  const localVerify = async (email, password, done) => {
    let user;
    await withDb(async (db) => {
      user = await db.collection('users').findOne({ email: email });
    });

    if (user == null) {
      return done(null, false, { message: 'No user with this email.' });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect.' });
      }
    } catch (err) {
      console.log(err);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, localVerify));

  passport.serializeUser((user, done) => {
    done(null, user._id.toString());
  });
  passport.deserializeUser(async (id, done) => {
    let user;
    await withDb(async (db) => {
      user = await db.collection('users').findOne({ _id: ObjectId(id) });
    });

    return done(null, user);
  });
}

export default initialize;
