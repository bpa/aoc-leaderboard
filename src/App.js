import Leaderboard from "./Leaderboard";
import BegSession from "./BegSession";
import useLocalStorage from "./useLocalStorage";
import { useCookies } from "react-cookie";

function App() {
    const [cookies, setCookie, removeCookie] = useCookies(['session']);
    const [leaderboard, setLeaderboard] = useLocalStorage("leaderboard", "");
    const [year, setYear] = useLocalStorage("year", 2021);

    let view;
    if (!(cookies['session'] && leaderboard)) {
        view = <BegSession setCookie={setCookie} setLeaderboard={setLeaderboard} year={year} />;
    } else {
        view = <Leaderboard leaderboard={leaderboard} year={year} />;
    }

    const logout = () => {
        removeCookie('session');
    }

    return (<>
        <header>
            <div>
                <h1 className="title-global">
                    <a href="/">Private Leaderboard</a>
                </h1>
                <nav>
                    <ul>
                        <li><a href="#">[Events]</a></li>
                        <li><a href="#" onClick={logout}>[Logout]</a></li>
                    </ul>
                </nav>
                <div className="user">Me</div>
            </div>
            <div>
                <h1 className="title-event">
                    {"  "}
                    <span className="title-event-wrap">int y=</span>
                    <a href="#">2021</a>
                    <span className="title-event-wrap">;</span>
                </h1>
                <nav>
                    <ul>
                        <li><a href="#">[Leaderboard]</a></li>
                    </ul>
                </nav>
                <div className="user">This board</div>
            </div>
        </header>
        <div id="sidebar"></div>
        <main>
            {view}
        </main>
    </>);
}

export default App;