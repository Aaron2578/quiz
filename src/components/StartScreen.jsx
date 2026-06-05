function StartScreen({ numQuestions, dispatch }) {
    return (
        <div className="start">
            <h2>Welcome to The SAP FICO Quiz!</h2>
            <h3>{numQuestions} Question to test your SAP FICO Mastery</h3>
            <button className="btn btn-ui" onClick={() => dispatch({ type: 'start' })}>Let's Start</button>
        </div>
    )
}

export default StartScreen
