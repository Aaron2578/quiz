function FinishScreen({ points, maxPoints, highScore, dispatch }) {

    const percentage = (points / maxPoints) * 100
    return (
        <>
            <p className="result">
                You Scored {points} outof {maxPoints} ({Math.ceil(percentage)}%)
            </p>
            <p className="highscore">(HightScore : {highScore} points)</p>
            <button className="btn btn-ui" onClick={() => dispatch({ type: 'restart' })}>Restart</button>
        </>
    )
}

export default FinishScreen
