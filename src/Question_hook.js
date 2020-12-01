import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { set } from 'mongoose'

const API_ROOT = 'http://localhost:4000/api'
const instance = axios.create({
  baseURL: API_ROOT
})

function Question() {
  const [complete, setComplete] = useState(false)  // true if answered all questions
  const [contents, setContents] = useState([])     // to store questions
  const [ans, setAns] = useState([])               // to record your answers
  const [score, setScore] = useState(0)            // Your score
  const [current_question, setCurrentQuestion] = useState(0) // index to current question
  const [chosen, setChosen] = useState(0);

  const next = () => {
    // TODO : switch to the next question,
    // and check answers to set the score after you finished the last question
    if(current_question + 1 < contents.length)
    {
      setCurrentQuestion(current_question+1);
    }
    else if (current_question + 1 === contents.length)
    {
      setComplete(true);
      console.log(ans);
      instance.post('/checkAns', { params: { ans } }).then(response => {
        console.log(response);
        setScore(response.data.score);
      });
    }
    setChosen(0);
  }

  const choose = (e) => {
    // TODO : update 'ans' for the option you clicked
    if(e.target.checked)
    {
      console.log(`Option ${e.target.className} is chosen`);
      setChosen(Number(e.target.className));
    }
    if(ans.length <= current_question)
    {
      setAns([...ans, Number(e.target.className)]);
    }
    else
    {
      setAns(ans.map((ans, index) => (
        index == current_question ?  Number(e.target.className): ans
      )))
    }
  }

  const getQuestions = () => {
    // TODO : get questions from backend
    instance.get('/getContents').then(respond => {
      console.log(respond);
      if(respond.data.message === 'error')
      {
        console.log('error retrieving contents');
      }
      else if(respond.data.message === 'success')
      {
        console.log('success on retrieving contents');
        setContents(respond.data.contents);
      }
      console.log(respond);
    });
    
  }

  useEffect(() => {
    if (!contents.length)
      getQuestions()
  })
  // getQuestions();
  // TODO : fill in the rendering contents and logic
  return (
    <div id="quiz-container"> 
      {contents.length ?
        <React.Fragment>
          <div id="question-box">
            <div className="question-box-inner">
              {`Question ${current_question + 1} of ${contents.length}`}
            </div>
          </div>

          <div id="question-title">
            {complete ? `Your Score ${score}/${contents.length}`:contents[current_question].question}
          </div>

          <div id="options">
            {complete ?  <></> : contents[current_question].options.map((option, index) => (
              <div className="each-option">
                <input 
                  type="radio"
                  name={`option-check${current_question+1}`}
                  id={`q${current_question+1}_${index+1}`}
                  className={index+1}
                  checked={chosen === (index+1) ? true:false}
                  onChange={choose}
                />
                <span>
                  {option}
                </span>
              </div>
            ))}
          </div>
          
          {complete?<></>:<div id="actions" onClick={next}>
            NEXT
          </div>}
        </React.Fragment>
        : <React.Fragment></React.Fragment>
      }
    </div>
  )
}

export default Question
