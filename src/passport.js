// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import withDb from './database/dbUtils';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: 'http://localhost:8000/auth/google/callback',
//     },
//     (accessToken, refreshToken, profile, done) => {
//       return done();
//     }
//   )
// );

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

// passport middlewares
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/auth/login');
};

const checkNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
};

export default initialize;
export { checkAuthenticated, checkNotAuthenticated };
