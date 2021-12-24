import * as functions from 'firebase-functions';
import express from 'express';
import axios from 'axios';

const app = express();

interface Star {
    name: string;
    quote: string;
    count?: number;
}

const colors = [
    { name: 'blue', color: '#02b0f9' },
    { name: 'red', color: '#fe5e65' },
    { name: 'green', color: '#4ce734' },
    { name: 'normal', color: '#fece68' },
] as const;

app.get('/api/hatena-stars', async (req, res) => {
    const path = req.query.path;
    if (typeof path === 'string' && path.match(/^\/archives\/[a-z0-9]+$/)) {
        const url = 'https://blog.hideo54.com' + path;
        const hatenaStarApiResponse = await axios.get<{
            entries: {
                uri: string;
                stars: Star[];
                colored_stars?: {
                    stars: Star[];
                    color: typeof colors[number]['name'];
                }[];
                can_comment: 0 | 1;
            }[];
            can_comment: 0 | 1;
        }>(`http://s.hatena.com/entry.json?uri=${encodeURIComponent(url)}`);
        const entries = hatenaStarApiResponse.data.entries;
        if (entries.length === 0) {
            res.status(200).json({
                ok: true,
                allStars: [],
            });
        } else {
            const { stars, colored_stars } = hatenaStarApiResponse.data.entries[0];
            const allStars = stars.map(star => ({
                ...star,
                color: 'normal',
            }));
            if (colored_stars) {
                for (const colorStar of colored_stars) {
                    for (const star of colorStar.stars) {
                        allStars.push({
                            ...star,
                            color: colorStar.color,
                        });
                    }
                }
            }
            res.status(200).json({
                ok: true,
                allStars,
            });
        }
    } else {
        res.status(400).json({ ok: false });
    }
});

const hatenaStars = functions.region('us-central1') // Firebase Hosting の制約
    .https.onRequest(app);

export default hatenaStars;
