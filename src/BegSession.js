import { useState } from 'react';

function BegSession({ setCookie, setLeaderboard, year }) {
    const [err, setErr] = useState('');

    const onSubmit = (e) => {
        let url = new RegExp('/leaderboard/private/view/(\\d+)');
        setCookie('session', e.target[0].value, { path: '/' });
        fetch(`/adventofcode/${year}/leaderboard/private`)
            .then(r => r.text())
            .then(html => setLeaderboard(html.match(url)[1]))
            .catch(e => setErr('Invalid Session'));
        e.preventDefault();
    };

    return (
        <article>
            <form onSubmit={onSubmit}>
                <p>
                    <input type="text" name="session"></input>
                    <input type="submit" value="[Set]"></input>
                </p>
            </form>
            <div>Get the session here</div>
            <div>{err}</div>
        </article>);
}

export default BegSession;