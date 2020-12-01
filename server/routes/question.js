import Question from '../models/Question'
import Answer from '../models/Answer'

exports.GetContents = async (req, res) => {
  // TODO : get questions from mongodb and return to frontend
  var contents = await Question.find({},(err, question) => {
    console.log('getContents called')
    if (err || !contents)
    {
      console.log('getContents failed');
      res.status(403).send({
        message: 'error',
        contents: []
      });
    }
    else
    {
      res.status(200).send({
        message: 'success',
        contents: contents
      });
    }
  });
}

exports.CheckAns = async (req, res) => {
  // TODO : get answers from mongodb,
  // check answers coming from fronten  d and return score to frontend
  await Answer.find({},(err,answers) => {
    console.log('checkAns called')
    if (err || !answers)
    {
      console.log('error fetching answers from mangoDB')
      res.status(403).send({
        message: 'error',
        score: -1
      });
    }
    else
    {
      console.log(req.body.params.ans)
      var score = 0;
      for (let index = 0; index < answers.length; index++) {
        const element = answers[index];
        if(req.body.params.ans[index] === element.answer)
        {
          score++;
        }
      }
      res.status(200).send({
        message: 'success',
        score: score
      });
    }
  })
}
