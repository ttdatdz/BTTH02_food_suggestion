const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const cors = require('cors');

// Khởi tạo ứng dụng Express
const app = express();
app.use(cors()); // Cho phép CORS
app.use(bodyParser.json()); // Parse body request dạng JSON

/**
 * Hàm chuẩn hóa chuỗi tiếng Việt (bỏ dấu và chuyển về chữ thường)
 * @param {string} str - Chuỗi cần chuẩn hóa
 * @returns {string} Chuỗi đã được chuẩn hóa
 */
const removeDiacritics = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

/**
 * API endpoint để nhận gợi ý món ăn
 * Method: POST
 * Body: { ingredients: string[] }
 */
app.post('/suggest', (req, res) => {
    // Validate input
    if (!req.body.ingredients || !Array.isArray(req.body.ingredients)) {
        return res.status(400).send({ error: "Invalid ingredients format" });
    }

    // Chuẩn hóa danh sách nguyên liệu
    const ingredientsStr = req.body.ingredients
        .map(i => `'${removeDiacritics(i.trim())}'`)
        .join(',');

    // Tạo command để gọi Prolog
    const cmd = `"C:\\Program Files\\swipl\\bin\\swipl.exe" -s recipes.pl -g "suggest_all_recipes([${ingredientsStr}], Recipes), maplist(format_recipe_output, Recipes, FormattedList), writeln(FormattedList)." -t halt`;

    console.log("Executing command:", cmd);

    // Thực thi command Prolog
    exec(cmd, { encoding: 'utf8' }, (err, stdout, stderr) => {
        if (err) {
            console.error("Prolog error:", stderr);
            return res.status(500).send({ error: err.message });
        }

        try {
            console.log("Raw output:", stdout);

            // Xử lý trường hợp không có kết quả
            if (!stdout || stdout.trim() === '[]') {
                return res.send({ suggestions: [] });
            }

            // Chuẩn hóa output từ Prolog
            const raw = stdout.trim()
                .replace(/^\[|\]$/g, '')
                .replace(/\s+/g, ' ');

            // Parse kết quả từ Prolog
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

// Khởi động server trên port 3000
app.listen(3000, () => {
    console.log('Backend running at http://localhost:3000');
});