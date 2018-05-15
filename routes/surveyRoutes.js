const _ = require('lodash');
const Path = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false // Don't give us any recipients
    });

    res.send(surveys);
  }); // Making an axios.get request to /api/surveys will now yield all of our sent surveys

  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for your feedback! :D');
  });

  app.post('/api/surveys/webhooks', (req, res) => {
    const p = new Path('/api/surveys/:surveyId/:choice');

    _.chain(req.body)
      .map(({ email, url }) => {
        const match = p.test(new URL(url).pathname); //p.test will either return an object w/ surveyId and choice, or null, so we can't destructure
        if (match) {
          return {
            email,
            surveyId: match.surveyId,
            choice: match.choice
          };
        }
      })
      .compact() // Goes through all elements in an array and removes everything that's undefined. Comes from lodash
      .uniqBy('email', 'surveyId') // Makes sure we never have any duplicate records in the array with the same email and survey ID. We wont have multiple responses from the same person for a single survey
      .each(({ surveyId, email, choice }) => {
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, responded: false }
            }
          },
          {
            $inc: { [choice]: 1 },
            $set: { 'recipients.$.responded': true },
            lastResponded: new Date()
          }
        ).exec();
      })
      .value();
    res.send({});
  });

  // Survey Creation Route
  // If anyone makes a post request to this route, make sure they're logged in and make sure they have enough credits
  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body; // ES6 destructuring. Gets those objects off the body

    // Makes an instance of a survey in memory, hasn't been persisted to a database yet
    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    // Gr8 place to send an email
    const mailer = new Mailer(survey, surveyTemplate(survey));
    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};
