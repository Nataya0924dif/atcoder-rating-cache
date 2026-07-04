const USER_IDS = ["tourist", "chokudai", "e869120"]; // ← あとで実際のIDに書き換える

async function fetchRating(user) {
    const url = `https://atcoder.jp/users/${user}/history/json`;
    const res = await fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const history = await res.json();
    const rated = history.filter(h => h.IsRated);
    if (rated.length === 0) return { user, rating: null, highest: null };
    const current = rated.at(-1).NewRating;
    const highest = Math.max(...rated.map(h => h.NewRating));
    return { user, rating: current, highest };
}

async function main() {
    const results = [];
    for (const user of USER_IDS) {
        try {
            const r = await fetchRating(user);
            console.log(`✓ ${user}: ${r.rating} (最高: ${r.highest})`);
            results.push(r);
        } catch (e) {
            console.error(`✗ ${user}: ${e.message}`);
            results.push({ user, rating: null, highest: null });
        }
    }

    // dataフォルダにJSONとして保存
    const fs = await import("fs");
    fs.mkdirSync("data", { recursive: true });
    fs.writeFileSync(
        "data/ratings.json",
        JSON.stringify({ updated: new Date().toISOString(), users: results }, null, 2)
    );
    console.log("\n✓ data/ratings.json に保存しました");
}

main();