import React, { useState } from 'react';
import "./FoodSuggestion.css";

/**
 * Hàm chuẩn hóa chuỗi tiếng Việt (bỏ dấu và chuyển về chữ thường)
 * @param {string} str - Chuỗi cần chuẩn hóa
 * @returns {string} Chuỗi đã được chuẩn hóa
 */
const removeDiacritics = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

function FoodSuggestion() {
    // State quản lý trạng thái ứng dụng
    const [ingredients, setIngredients] = useState(''); // Chuỗi nguyên liệu nhập vào
    const [suggestions, setSuggestions] = useState([]); // Danh sách món ăn gợi ý
    const [error, setError] = useState(''); // Thông báo lỗi
    const [isLoading, setIsLoading] = useState(false); // Trạng thái loading

    /**
     * Hàm gọi API để lấy gợi ý món ăn từ BE
     */
    const getSuggestions = async () => {
        setError('');
        setSuggestions([]);
        setIsLoading(true);

        try {
            // Chuẩn hóa danh sách nguyên liệu đầu vào
            const ingredientsList = ingredients.split(',')
                .map(i => removeDiacritics(i.trim()))
                .filter(i => i.length > 0);

            // Gọi API đến backend
            const response = await fetch('http://localhost:3000/suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ingredients: ingredientsList })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            setSuggestions(data.suggestions);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm reset trạng thái ứng dụng
    const handleReset = () => {
        setIngredients('');
        setSuggestions([]);
        setError('');
    };

    return (
        <div className="food-suggestion-container">
            {/* Phần header */}
            <div className="header-section">
                <h1 className="app-title">🍳 Food Suggestion App</h1>
                <p className="app-subtitle">Nhập nguyên liệu bạn có và nhận gợi ý món ăn (có dấu hoặc không dấu)</p>
            </div>

            {/* Phần nhập liệu */}
            <div className="input-section">
                <input
                    value={ingredients}
                    onChange={e => setIngredients(e.target.value)}
                    placeholder="Nhập nguyên liệu (cách nhau bằng dấu phẩy), ví dụ: trứng, hành hoặc trung, hanh"
                    className="ingredient-input"
                />
                <div className="button-group">
                    <button
                        onClick={getSuggestions}
                        className="suggest-button"
                        disabled={isLoading || !ingredients.trim()}
                    >
                        {isLoading ? 'Đang tìm kiếm...' : 'Gợi ý món ăn'}
                    </button>
                    <button
                        onClick={handleReset}
                        className="reset-button"
                        disabled={isLoading}
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Hiển thị lỗi nếu có */}
            {error && <p className="error-message">{error}</p>}

            {/* Hiển thị danh sách gợi ý */}
            {suggestions.length > 0 && (
                <div className="suggestions-section">
                    <h2 className="suggestions-title">Gợi ý món ăn</h2>
                    <div className="suggestions-grid">
                        {suggestions.map((item, index) => (
                            <div key={index} className="recipe-card">
                                <h3 className="recipe-name">{item.name}</h3>
                                <div className="ingredients-list">
                                    <h4>Nguyên liệu cần:</h4>
                                    <ul>
                                        {item.ingredients.map((ing, i) => (
                                            <li key={i} className="ingredient-item">
                                                {ing}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FoodSuggestion;