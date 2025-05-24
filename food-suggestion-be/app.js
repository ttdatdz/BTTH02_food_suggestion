const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/suggest', (req, res) => {
    if (!req.body.ingredients || !Array.isArray(req.body.ingredients)) {
        return res.status(400).send({ error: "Invalid ingredients format" });
    }

    const ingredientsStr = req.body.ingredients
        .map(i => `'${i.trim().toLowerCase()}'`)
        .join(',');

    const cmd = `"C:\\Program Files\\swipl\\bin\\swipl.exe" -s recipes.pl -g "findall(Formatted, (suggest_recipe_with_ingredients([${ingredientsStr}], R-I), format_recipe_output(R-I, Formatted)), List), writeln(List)." -t halt`;

    console.log("Executing command:", cmd);

    exec(cmd, { encoding: 'utf8' }, (err, stdout, stderr) => {
        if (err) {
            console.error("Prolog error:", stderr);
            return res.status(500).send({ error: err.message });
        }

        try {
            console.log("Raw output:", stdout);

            if (!stdout || stdout.trim() === '[]') {
                return res.send({ suggestions: [] });
            }

            const raw = stdout.trim()
                .replace(/^\[|\]$/g, '')
                .replace(/\s+/g, ' ');

            const suggestions = [];
            const pattern = /'([^']+)'-\[([^\]]*)\]/g;

            let match;
            while ((match = pattern.exec(raw)) !== null) {
                const ingredients = match[2].split(',')
                    .map(i => i.trim().replace(/'/g, ''))
                    .filter(i => i.length > 0);

                suggestions.push({
                    name: match[1].trim(),
                    ingredients: ingredients
                });
            }

            console.log("Parsed suggestions:", suggestions);
            res.send({ suggestions });
        } catch (parseError) {
            console.error("Parse error:", parseError);
            res.status(500).send({
                error: "Lỗi phân tích kết quả",
                rawOutput: stdout
            });
        }
    });
});

app.listen(3000, () => {
    console.log('Backend running at http://localhost:3000');
});