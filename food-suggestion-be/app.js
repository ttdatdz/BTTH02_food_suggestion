const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.post('/suggest', (req, res) => {
    // Thêm bước validate và chuẩn hóa input
    if (!req.body.ingredients || !Array.isArray(req.body.ingredients)) {
        return res.status(400).send({ error: "Invalid ingredients format" });
    }

    // Chuẩn hóa nguyên liệu - bỏ khoảng trắng và chuyển thành chữ thường
    const normalizedIngredients = req.body.ingredients
        .map(i => i.trim().toLowerCase())
        .filter(i => i.length > 0);

    // Log để debug
    console.log("Received ingredients:", normalizedIngredients);

    // Tạo chuỗi truy vấn Prolog an toàn hơn
    const ingredientsStr = normalizedIngredients.map(i => `'${i}'`).join(',');
    const cmd = `"C:\\Program Files\\swipl\\bin\\swipl.exe" -s recipes.pl -g "findall(R, suggest_recipe([${ingredientsStr}], R), List), writeln(List)." -t halt`;

    console.log("Executing command:", cmd); // Log command để debug

    exec(cmd, (err, stdout, stderr) => {
        if (err) {
            console.error("ProLog error:", stderr);
            return res.status(500).send({ error: err.message });
        }

        console.log("ProLog output:", stdout); // Log output từ Prolog

        const suggestions = stdout
            .trim()
            .replace(/[\[\]'\n\r]/g, '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);

        res.send({ suggestions });
    });
});

app.listen(3000, () => {
    console.log('Backend running at http://localhost:3000');
});
