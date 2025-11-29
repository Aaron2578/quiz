import Header from './Header'
import Content from './Content'
import Loader from "./Loader"
import Error from "./Error"
import Question from './Question'
import { useEffect, useReducer } from 'react'
import StartScreen from './StartScreen'
import NextButton from './NextButton'
import Progress from './Progress'
import FinishScreen from './FinishScreen'
import Footer from './Footer'
import Timer from './Timer'
export default function App() {

    const SECS_PER_QUESTION = 30;

    const initialState = {
        questions: [],
        status: 'loading',
        index: 0,
        answer: null,
        points: 0,
        highScore: 0,
        secondsRemaining: null,
    }
    function reducer(state, action) {
        switch (action.type) {
            case 'dataReceived':
                return {
                    ...state,
                    questions: action.payload,
                    status: 'ready'
                };
            case 'dataFailed':
                return {
                    ...state,
                    status: 'error'
                };
            case 'start':
                return {
                    ...state,
                    status: 'active',
                    secondsRemaining: state.questions.length * SECS_PER_QUESTION,
                };
            case 'newAnswer':
                {
                    const question = state.questions.at(state.index);
                    return {
                        ...state,
                        answer: action.payload,
                        points: action.payload === question.correctOption ? state.points + question.points : state.points,
                    }
                };
            case 'nextQuestion':
                return {
                    ...state,
                    index: state.index + 1,
                    answer: null
                };
            case 'finish':
                return {
                    ...state,
                    status: 'finish',
                    highScore: state.points > state.highScore ? state.points : state.highScore
                };
            case 'restart':
                return {
                    ...initialState, questions: state.questions, status: 'ready',
                };
            case 'tick':
                return {
                    ...state,
                    secondsRemaining: state.secondsRemaining - 1,
                    status: state.secondsRemaining === 0 ? "finish" : state.status
                }
            default:
                throw new Error("Unknow Action")
        }
    }

    const [{ status, questions, index, answer, points, highScore, secondsRemaining }, dispatch] = useReducer(reducer, initialState)

    const numQuestions = questions.length;
    const maxPoints = questions.reduce((prev, curr) => prev + curr.points, 0)

    useEffect(() => {
        async function questions() {
            try {
                const res = await fetch('https://quiz-db-2.onrender.com/questions')
                if (!res.ok) throw new Error("Network Error")
                const data = await res.json();
                dispatch({ type: 'dataReceived', payload: data })
                console.log(data)
            } catch (err) {
                dispatch({ type: 'dataFailed', payload: err })
            }
        }
        questions()
    }, [])
    return (
        <div className="app">
            <Header />
            <Content>
                {status === 'loading' && <Loader />}
                {status === 'error' && <Error />}
                {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
                {status === 'active' &&
                    <>
                        <Progress index={index} numQuestions={numQuestions} points={points} maxPoints={maxPoints} answer={answer} />
                        <Question question={questions[index]} dispatch={dispatch} answer={answer} />
                        <Footer>
                            <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
                            <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions} />
                        </Footer>
                    </>}
                {status === 'finish' && <FinishScreen points={points} maxPoints={maxPoints} highScore={highScore} dispatch={dispatch} />}
            </Content>
        </div>
    )
}