import { useEffect, useState } from "react";

const oneDay = 60 * 60 * 24;
const tzOffset = 300 * 60 * 1000;

function completionText(elapsed) {
    if (!elapsed) {
        return '--:--:--';
    } else if (elapsed > oneDay) {
        return '  >24h  ';
    }
    let seconds = elapsed % 60;
    elapsed = (elapsed - seconds) / 60;
    let minutes = elapsed % 60;
    elapsed = (elapsed - minutes) / 60;
    return [elapsed, minutes, seconds].map(n => n.toString().padStart(2, '0')).join(':');
}

function cmp(a, b, key) {
    if (a.completion[key]) {
        if (b.completion[key]) {
            return a.completion[key] - b.completion[key];
        } else {
            return -1;
        }
    } else if (b.completion[key]) {
        return 1;
    }
    return 0;
}

function Leaderboard({ leaderboard, year }) {
    const dateInEST = new Date(new Date().getTime() + tzOffset);
    const [data, setData] = useState({});
    const [day, setDay] = useState(0);
    const dayOfMonth = dateInEST > new Date(`${year}-12-25T00:00:00-05:00`) ? 25 : dateInEST.getDate();
    const members = Object.values(data['members'] || {}).sort((a, b) => {
        let diff = 0;
        if (day) {
            diff = cmp(a, b, `${day}-2`) || cmp(a, b, `${day}-1`);
        }
        return diff || b.local_score - a.local_score || a.last_star_ts - b.last_star_ts;
    });

    useEffect(() => {
        const start = Math.floor((new Date(`${year}-12-01T00:00:00-05:00`)).getTime() / 1000);
        fetch(`/adventofcode/${year}/leaderboard/private/view/${leaderboard}.json`)
            .then(res => res.json())
            .then(res => Object.values(res['members'] || {}).map(m => {
                let stars = {};
                if (m['completion_day_level']) {
                    for (const day in m['completion_day_level']) {
                        const completion = m['completion_day_level'][day];
                        for (const star in completion) {
                            let elapsed = completion[star]['get_star_ts'] - start - (oneDay * (day - 1));
                            stars[`${day}-${star}`] = elapsed;
                        }
                    }
                }
                return {
                    name: m.name || `(anonymous user #${m.id})`,
                    completion: stars,
                    local_score: m.local_score,
                    global_score: m.global_score,
                    last_star_ts: m.last_star_ts,
                    stars: m.stars,
                }
            }))
            .then(members => {
                return {
                    nameWidth: 3 + Math.max(...members.map(m => m.name.length)),
                    digits: Math.floor(Math.log10(Math.max(...members.map(m => m['local_score'])))),
                    members: members,
                }
            })
            .then(leaderboard => setData(leaderboard));
    }, [year, leaderboard]);

    const dayChanged = (e) => {
        setDay(e.target.text);
    };

    const dayText = (day) => {
        if (day < 10) {
            return day;
        }
        let ones = day % 10;
        let tens = (day - ones) / 10;
        return (<>{tens}<br />{ones}</>);
    };

    const dayLinks = () => {
        let items = [];
        for (let i = 1; i < 26; i++) {
            if (i > dayOfMonth) {
                items.push(<span>{dayText(i)}</span>)
            } else {
                items.push(<a href="#" onClick={dayChanged} key={i}>{dayText(i)}</a>);
            }
        }
        return items;
    };

    const stars = (u) => {
        let stars = [];
        for (let i = 1; i < 26; i++) {
            let cls = i > dayOfMonth ? "privboard-star-locked" : "privboard-star-unlocked";
            if (`${i}-1` in u.completion) { cls = "privboard-star-firstonly" }
            if (`${i}-2` in u.completion) { cls = "privboard-star-both" }
            stars.push(<span className={cls} key={i}>*</span>);
        }
        return stars;
    };

    const user = (u, i) => {
        return (
            <div className="privboard-row">
                <span className="privboard-position">{`${i + 1}`.padStart(2, ' ')})</span>
                {` ${u.local_score} `.padStart(data.digits + 3, ' ')}
                {stars(u)}
                {'  '}
                <span
                    className="privboard-name">{u.name.padEnd(data.nameWidth, ' ')}</span>
                {day ? completionText(u.completion[`${day}-1`]) + '  ' + completionText(u.completion[`${day}-2`]) : null}
            </div>);
    };

    const timeHeader = () => {
        if (!day) {
            return null;
        }

        return (<>
            <span className="leaderboard-daydesc-first">-Part 1-</span>
            {'  '}
            <span className="leaderboard-daydesc-both">-Part 2-</span>
        </>
        );
    };

    return (
        <article>
            <p>
                <span className="privboard-star-both">Gold</span>
                {' indicates the user got both stars for that day, '}
                <span className="privboard-star-firstonly">silver</span>
                {' means just the first star, and '}
                <span className="privboard-star-unlocked">gray</span>
                {' means none. '}
            </p>
            <div className="privboard-row">
                {''.padStart(data.digits + 6, ' ')}
                <span className="privboard-days">{dayLinks()}</span>
                {'  '}
                <a href="#" onClick={() => setDay(0)}>Overall</a>
                {''.padEnd(data.nameWidth - 7, ' ')}

                {timeHeader()}
            </div>
            <div className="privboard-row">
                <span className="privboard-days">
                    {members.map(user)}
                </span>
            </div>
        </article>
    );
}

export default Leaderboard;
