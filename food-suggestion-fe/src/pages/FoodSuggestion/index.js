import React, { useState } from 'react';

function FoodSuggestion() {
    const [ingredients, setIngredients] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState('');

    const getSuggestions = async () => {
        console.log("Đang gửi request..."); // Debug 1
        const ingredientsList = ingredients.split(',').map(i => i.trim());
        console.log("Nguyên liệu:", ingredientsList); // Debug 2

        try {
            const response = await fetch('http://localhost:3000/suggest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ingredients: ingredientsList }),
            });

            console.log("Nhận được response:", response); // Debug 3

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Dữ liệu nhận được:", data); // Debug 4
            setSuggestions(data.suggestions);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error); // Debug 5
            setError('Không thể kết nối đến server: ' + error.message);
        }
    };
    return (
        <div style={{ padding: 40 }}>
            <h2>Đề Xuất Món Ăn</h2>
            <input
                value={ingredients}
                onChange={e => setIngredients(e.target.value)}
                placeholder="Nhập nguyên liệu, ví dụ: trứng, hành"
                style={{ width: 300, padding: 8 }}
            />
            <button onClick={getSuggestions} style={{ marginLeft: 10 }}>Đề Xuất</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ul>
                {suggestions.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
}

export default FoodSuggestion;
