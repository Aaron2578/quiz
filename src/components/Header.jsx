import react from "../assets/react.svg"
import quiz from "../assets/quiz-logo.png"
function Header() {
  return (
    <header className='app-header'>
      <img src={quiz} alt='React logo' width={20}/>
      <h2>The Python Quiz</h2>
    </header>
  );
}

export default Header;
